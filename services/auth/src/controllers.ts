import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/jani-ai-auth";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);


const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}


export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const token = generateToken({ id: user._id, email: user.email });

    res.json({ accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({ id: user._id, email: user.email });

    res.json({ accessToken: token });
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

    res.json({ email: dbUser.email, id: dbUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}  
