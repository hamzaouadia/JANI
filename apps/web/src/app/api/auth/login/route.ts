import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, identifier } = body;

    if (!email || !password || !role || !identifier) {
      return NextResponse.json(
        { error: "Email, password, role, and identifier are required" },
        { status: 400 }
      );
    }

    // Forward to auth microservice
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, identifier, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const error = JSON.parse(errorText);
        return NextResponse.json(error, { status: response.status });
      } catch {
        return NextResponse.json({ error: "Authentication failed" }, { status: response.status });
      }
    }

    const data = await response.json();

    // Create response with httpOnly cookie
    const res = NextResponse.json({
      user: data.user,
      message: "Login successful",
    });

    // Set httpOnly cookie
    res.cookies.set("token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 503 }
    );
  }
}
