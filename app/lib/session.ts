import { cookies } from "next/headers";

export type SessionUser = {
  id: number;
  name: string;
  role: "admin" | "customer";
};

const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Call this after successful login to set the cookie
export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  const value = Buffer.from(JSON.stringify(user)).toString("base64");
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: false, // Set to true only when hosting on HTTPS
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

// Call this to get the currently logged-in user (returns null if not logged in)
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie.value, "base64").toString()) as SessionUser;
  } catch {
    return null;
  }
}

// Call this on logout to clear the cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}