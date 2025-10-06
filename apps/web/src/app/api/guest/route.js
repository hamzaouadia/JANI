export const runtime = "nodejs";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  const guestUser = { id: "guest123", role: "guest", email: "guest@example.com" };

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT_SECRET is not set in env" },
      { status: 500 }
    );
  }

  const token = jwt.sign(guestUser, process.env.JWT_SECRET, { expiresIn: "1h" });

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // 👈 less strict so it works in dev
    path: "/",
  });

  return res;
}
