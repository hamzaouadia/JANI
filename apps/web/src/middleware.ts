import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public routes
  if (["/", "/login", "/signup"].includes(pathname)) {
    return NextResponse.next();
  }

  // Skip Next internal and error pages (avoid interfering with prerendering/build)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_error') ||
    pathname === '/500' ||
    pathname === '/404'
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value || req.cookies.get("auth-token")?.value;
  
  if (!token) {
    console.log("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Handle direct admin token
  if (token.startsWith("admin_token_")) {
    // Check if accessing admin routes
    if (pathname.startsWith("/admin")) {
      console.log("Admin token verified for admin panel");
      return NextResponse.next();
    } else {
      // Redirect admin to admin panel
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  try {
    // Call internal API route instead of direct service call (Edge Runtime compatible)
    const verifyUrl = new URL("/api/auth/verify", req.url);
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Token verification failed");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userData = await response.json();
    
    // Check if accessing admin routes
    if (pathname.startsWith("/admin")) {
      if (userData.user?.role !== "admin") {
        console.log("Unauthorized access to admin panel");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    console.log("Token verified successfully");
    return NextResponse.next();
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except API, static assets, images
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
