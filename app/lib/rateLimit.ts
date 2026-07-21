import { headers } from "next/headers";

type RateLimitInfo = {
    count: number;
    resetTime: number;
};

const globalForLimiters = globalThis as unknown as {
    limiters: Map<string, RateLimitInfo> | undefined;
};

const limiters = globalForLimiters.limiters ?? new Map<string, RateLimitInfo>();
if (process.env.NODE_ENV !== "production") {
    globalForLimiters.limiters = limiters;
}

/**
 * Gets the client IP address from the request headers.
 */
export async function getClientIp(): Promise<string> {
    try {
        const headerList = await headers();
        const xForwardedFor = headerList.get("x-forwarded-for");
        if (xForwardedFor) {
            return xForwardedFor.split(",")[0].trim();
        }
    } catch {
        // Fallback if headers are not available or called outside a request context
    }
    return "127.0.0.1";
}

/**
 * Checks if a key has exceeded its rate limit.
 * 
 * @param key The rate limit identifier
 * @param limit The maximum number of allowed requests in the time window
 * @param windowSeconds The duration of the window in seconds
 */
export async function checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const info = limiters.get(key);

    if (!info || now > info.resetTime) {
        limiters.set(key, { count: 1, resetTime: now + windowMs });
        return { success: true, remaining: limit - 1, reset: windowSeconds };
    }

    if (info.count >= limit) {
        const reset = Math.ceil((info.resetTime - now) / 1000);
        return { success: false, remaining: 0, reset };
    }

    info.count += 1;
    return { success: true, remaining: limit - info.count, reset: Math.ceil((info.resetTime - now) / 1000) };
}
