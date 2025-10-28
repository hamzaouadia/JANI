import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if auth service is reachable
    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:4000";
    let authStatus = "unknown";
    
    try {
      const authResponse = await fetch(`${authServiceUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });
      authStatus = authResponse.ok ? "connected" : "unreachable";
    } catch (error) {
      console.warn("Auth service health check failed:", error);
      authStatus = "unreachable";
    }

    const healthCheck = {
      service: "JANI Web Application",
      status: authStatus === "connected" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      nextjs: {
        version: process.env.npm_package_version || "unknown",
      },
      dependencies: {
        authService: {
          url: authServiceUrl,
          status: authStatus,
        },
      },
    };

    const statusCode = authStatus === "connected" ? 200 : 503;

    return NextResponse.json(healthCheck, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        service: "JANI Web Application",
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
