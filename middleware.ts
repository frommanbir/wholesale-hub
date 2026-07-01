import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "session";

function getSessionFromRequest(req: NextRequest) {
    const cookie = req.cookies.get(COOKIE_NAME);
    if (!cookie) return null;
    try {
        return JSON.parse(Buffer.from(cookie.value, "base64").toString());
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const session = getSessionFromRequest(req);

    // Protect all /admin/* routes — must be logged in as admin
    if (pathname.startsWith("/admin")) {
        if (!session || session.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // If already logged in and visiting /login → redirect to correct dashboard
    if (pathname === "/login" && session) {
        if (session.role === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Which routes this middleware runs on
export const config = {
    matcher: ["/admin/:path*", "/login"],
};
