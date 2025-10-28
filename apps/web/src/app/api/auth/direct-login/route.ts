import { NextRequest, NextResponse } from "next/server";

// Temporary direct login route that bypasses the auth service for admin access
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, identifier } = body;

    // Hardcoded admin credentials for direct access
    if (
      role === "admin" && 
      identifier === "ADMIN-001" && 
      email === "admin@jani.test" && 
      password === "Admin123!"
    ) {
      // Generate a simple token (in production, use proper JWT)
      const mockToken = `admin_token_${Date.now()}`;

      const response = NextResponse.json({
        user: {
          id: "admin-001",
          email: "admin@jani.test",
          role: "admin",
          identifier: "ADMIN-001",
          profile: {
            fullName: "System Administrator",
            department: "IT & Operations",
            accessLevel: "full"
          }
        },
        message: "Login successful"
      });

      response.cookies.set("auth-token", mockToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Direct login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}