import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect administrative dashboard views and administrative mutation APIs
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
