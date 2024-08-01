import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();
  const adminId = process.env.ADMIN_USER_ID;
  const isAdmin = userId === adminId;

  // Protect admin routes
  if (isAdminRoute(request)) {
    if (!isAdmin) {
      // Redirect non-admin users to the main dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (isDashboardRoute(request)) {
    if (!userId ) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdmin) {
      // Redirect admin users to the admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Allow the request to proceed for all other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
