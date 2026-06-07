import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl;
  const isAuthPage =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/verify");

  // Authenticated user on auth pages → send to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user on root → send to home/login
  if (!token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // All other cases (e.g. unauthenticated on /login) → allow through
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/verify"], // ✅ added /verify
};