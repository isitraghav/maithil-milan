import { auth } from "./auth";
import { NextResponse } from "next/server";

console.log("middleware called");

export async function middleware(req) {
  const session = await auth(); // Get the current session

  if (!session) {
    // Dynamically determine the host (works in both localhost & production)
    const host = req.nextUrl.origin;
    const redirectUrl = new URL(
      `/login?redirect=${req.nextUrl.pathname}`,
      host
    );

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next(); // Allow access if authenticated
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/matches/:path*",
    "/receivedmatches/:path*",
  ],
};
