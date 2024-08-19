import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();
  const adminId = process.env.ADMIN_USER_ID;
  const isAdmin = userId === adminId;
  const path = request.nextUrl.pathname;

  // Allow access to the root path and all other routes except /dashboard and /admin
  if (path !== "/dashboard" && !path.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Protect /dashboard route
  if (path === "/dashboard") {
    if (!userId) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Allow authenticated users to access dashboard
    return NextResponse.next();
  }

  // Protect /admin routes
  if (path.startsWith("/admin")) {
    if (!isAdmin) {
      // Redirect non-admin users to the main dashboard or home page
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow admin users to access admin routes
    return NextResponse.next();
  }

  // This line should never be reached, but included for completeness
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
