import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

import type { AuthUser } from "../types";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a strong secret in production



/**
 * Middleware to protect routes.
 * Usage: app.use(verifyToken)
 */
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Invalid token format" });
  
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload === "object" && payload !== null) {
      const { id, email, ...rest } = payload as { id?: string; email?: string; [key: string]: any };
      if (!id || !email) {
        return res.status(401).json({ error: "Token payload missing required user properties" });
      }
      req.user = { id, email, ...rest } as AuthUser;
      next();
    } else {
      return res.status(401).json({ error: "Invalid token payload" });
    }
  } catch (err) {
    console.log("error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
