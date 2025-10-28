import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import {
  User,
  type UserRole,
  ROLE_REQUIREMENTS,
  isUserRole,
  resolveIdentifier,
  normalizeProfile,
  serializeProfile,
  normalizeString
} from "./userModel";
import { JWT_SECRET } from "./config";

function generateToken(user: {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  role: UserRole;
  identifier: string;
}) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, identifier: user.identifier },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
}

export async function signup(req: Request, res: Response) {
  const { email, password, role, identifier, profile } = req.body;

  if (!isUserRole(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const normalizedEmail = normalizeString(email)?.toLowerCase();
  const normalizedPassword = normalizeString(password);

  if (!normalizedEmail || !normalizedPassword) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  let identifierValue: string;
  let normalizedProfile: Record<string, string>;

  try {
    identifierValue = resolveIdentifier(role, identifier, profile);
    normalizedProfile = normalizeProfile(role, profile);
    normalizedProfile[ROLE_REQUIREMENTS[role].identifier.name] = identifierValue;
  } catch (validationError) {
    return res.status(400).json({
      error:
        validationError instanceof Error ? validationError.message : "Invalid profile information"
    });
  }

  try {
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const existingIdentifier = await User.findOne({ role, identifier: identifierValue });
    if (existingIdentifier) {
      return res
        .status(400)
        .json({ error: `${ROLE_REQUIREMENTS[role].identifier.label} already registered` });
    }

    const passwordHash = await bcrypt.hash(normalizedPassword, 10);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      role,
      identifier: identifierValue,
      profile: normalizedProfile
    });

    const token = generateToken(user);

    res.json({
      accessToken: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        identifier: user.identifier,
        profile: serializeProfile(user.profile)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function login(req: Request, res: Response) {
  const { role, identifier, password } = req.body;

  if (!isUserRole(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const normalizedPassword = normalizeString(password);
  if (!normalizedPassword) {
    return res.status(400).json({ error: "Password is required" });
  }

  let identifierValue: string;

  try {
    identifierValue = resolveIdentifier(role, identifier, null);
  } catch (validationError) {
    return res.status(400).json({
      error:
        validationError instanceof Error ? validationError.message : "Identifier is required"
    });
  }

  try {
    const user = await User.findOne({ role, identifier: identifierValue });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(normalizedPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      accessToken: token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
        identifier: user.identifier,
        profile: serializeProfile(user.profile)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function me(req: Request, res: Response) {
  const user = (req as any).user; // set by authMiddleware
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const dbUser = await User.findById(user.id).select("-passwordHash");
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    res.json({
      email: dbUser.email,
      id: dbUser._id,
      role: dbUser.role,
      identifier: dbUser.identifier,
      profile: serializeProfile(dbUser.profile)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}  
