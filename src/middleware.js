import { auth } from "./auth";
import { NextResponse } from "next/server";

console.log("middleware called");

export async function middleware(req) {
  const session = await auth(); // Get the current session

  if (!session) {
    // Redirect unauthenticated users to /auth/signin
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next(); // Allow access if authenticated
}

export const config = {
  matcher: [
    "/profile/:path*",     // Protect /profile/*
    "/dashboard/:path*",   // Protect /dashboard/*
    // "/search/:path*",      // Protect /search/*
    "/matches/:path*",     // Protect /matches/*
    "/receivedmatches/:path*"
  ],
};

