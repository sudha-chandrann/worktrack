import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";



// Middleware function
export function middleware(request) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.includes(path);
  const authPaths = ["/dashboard", "/projects","/profile", "/settings"];
  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath));

  // Get token from cookies manually (fallback for Edge Runtime issues)
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
  const token = cookies["refreshToken"] || "";

  
  // Redirection logic
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  } else if (isAuthPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

// Define protected and public routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
    "/",
    "/projects/:path*"
  ],
};
