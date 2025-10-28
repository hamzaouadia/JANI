import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes";
import dataRoutes from "./dataRoutes";
import syncRoutes from "./syncRoutes";
import mediaRoutes from "./mediaRoutes";
import jobsRoutes from "./jobsRoutes";
import { connectDatabase } from "./database";

const app = express();
const PORT = process.env.PORT || 4000;

const allowOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : undefined;

const corsOptions: cors.CorsOptions = {
  origin: allowOrigin,
  credentials: true
};

app.use((req, res, next) => {
  const origin = req.header("Origin");
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(cors(corsOptions));

app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const mongoStates: { [key: number]: string } = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const healthCheck = {
    service: "JANI Auth Service",
    status: mongoStatus === 1 ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    mongodb: {
      status: mongoStates[mongoStatus],
      readyState: mongoStatus
    }
  };

  const statusCode = mongoStatus === 1 ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

app.use("/auth", authRoutes);
app.use("/data", dataRoutes);
app.use("/sync", syncRoutes);
app.use("/media", mediaRoutes);

// Debug: direct ping routes to verify mount
app.get("/pingroot", (_req, res) => res.json({ ok: true, src: "index" }));
app.get("/jobs/pingroot", (_req, res) => res.json({ ok: true, src: "index/jobs" }));
app.use("/jobs", jobsRoutes);

console.log("🔗 /sync routes registered");

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Auth service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start auth service:", err);
    process.exit(1);
  });
