import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@jani/auth/verifyToken";
import type { AuthUser } from "../libs/types";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser | null;
}

// Define minimal fake types to match Express expectations
interface FakeRequest {
  headers: Record<string, string>;
  user: AuthUser | null;
  get: (key: string) => string | undefined;
}

interface FakeResponse {
  status: (code: number) => { json: (data: unknown) => void };
  json: (data: unknown) => void;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public routes
  if (["/", "/login", "/signup"].includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Wrap verifyToken in a Promise
    await new Promise<void>((resolve, reject) => {
      const fakeReq: FakeRequest = {
        headers: Object.fromEntries(req.headers),
        user: null,
        get: (key: string) => req.headers.get(key) || undefined,
      };
      const fakeRes: FakeResponse = {
        status: (code: number) => ({
          json: () => {
            if (code >= 400) reject(new Error(`Auth failed with status ${code}`));
            else resolve();
          },
        }),
        json: () => resolve(),
      };

      // Call the auth middleware with typed fakes
      verifyToken(fakeReq as unknown as Request, fakeRes as unknown as Response, () => {
        (req as AuthenticatedRequest).user = fakeReq.user;
        resolve();
      });
    });

    // If auth succeeds, proceed to the requested route
    return NextResponse.next();
  } catch {
    // If auth fails, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except API, static assets, images
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
