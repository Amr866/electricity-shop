import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Maintenance Mode Interception
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    // Whitelist static files, auth endpoints, and the maintenance page itself
    const isWhitelisted =
      pathname === "/maintenance" ||
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/uploads") ||
      pathname === "/favicon.ico" ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml";

    if (!isWhitelisted) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      const isAdmin = token && token.role === "ADMIN";

      // If not authenticated as ADMIN, intercept and serve 503 Service Unavailable
      if (!isAdmin) {
        // Structured 503 for background API requests
        if (pathname.startsWith("/api/")) {
          const apiResponse = NextResponse.json(
            {
              error: "سامانه فروشگاه آنلاین در حال به‌روزرسانی است.",
              maintenance: true,
            },
            { status: 503 }
          );
          apiResponse.headers.set("Retry-After", "3600");
          return apiResponse;
        }

        // HTML 503 rewrite for browser visitors (preserves search engine rankings)
        const maintenanceUrl = new URL("/maintenance", req.url);
        const pageResponse = NextResponse.rewrite(maintenanceUrl, {
          status: 503,
          statusText: "Service Unavailable",
        });
        pageResponse.headers.set("Retry-After", "3600");
        return pageResponse;
      }
    }
  }

  // 2. Protect administrative dashboard views and administrative mutation APIs
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if session token exists and user has ADMIN role
    if (!token || token.role !== "ADMIN") {
      // API routes receive structured JSON 401/403
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "دسترسی غیرمجاز: نیازمند دسترسی مدیریت است." },
          { status: 403 }
        );
      }

      // Page routes redirect to login with original destination callback
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded static media)
     * - images (static local images)
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads|images).*)",
  ],
};
