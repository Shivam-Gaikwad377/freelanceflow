import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl;

  const isAuthPage =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register");

  const isProtectedPage = url.pathname.startsWith("/dashboard");

  // Authenticated user on auth pages → send to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user on protected pages → send to login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Unauthenticated user on root → send to home
  if (!token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // All other cases → allow through
  // This includes /verify — always accessible after signup
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};