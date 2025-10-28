import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import crypto from "crypto";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "5000", 10);
const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017/jani";
const jwtSecret = process.env.JWT_SECRET ?? "dev-secret-change-me";

// Middleware
app.use(cors());
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const mongoStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const healthCheck = {
    service: "JANI User Service",
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

// DB
mongoose
  .connect(mongoUri, { dbName: process.env.MONGO_DB ?? "jani" })
  .then(() => console.log("[user-service] Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

// Schemas
const HistorySchema = new mongoose.Schema(
  {
    change: { type: Object, default: {} },
    note: { type: String },
    byUserId: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const FarmSchema = new mongoose.Schema(
  {
    ownerUserId: { type: String, index: true, required: true },
    name: { type: String, required: true },
    identifier: { type: String, index: true, unique: true, sparse: true },
    // Store access code using scrypt with per-record salt
    accessCodeSalt: { type: String },
    accessCodeHash: { type: String },
    location: { type: String },
    status: { type: String, default: "active" },
    notes: { type: String },
    data: { type: Object, default: {} },
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true }
);

const FarmMemberSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", index: true, required: true },
    userId: { type: String, index: true, required: true },
    role: { type: String, enum: ["owner", "admin", "viewer"], default: "viewer" },
  },
  { timestamps: true }
);

const Farm = mongoose.model("Farm", FarmSchema);
const FarmMember = mongoose.model("FarmMember", FarmMemberSchema);

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: payload.sub || payload.userId || payload.id || payload._id };
    if (!req.user.id) return res.status(401).json({ error: "Invalid token" });
    next();
  } catch (error) {
    console.error("User service auth middleware failed to verify token", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Helpers
function hashAccessCode(accessCode, salt) {
  // 64-byte key, hex encoded
  const key = crypto.scryptSync(accessCode, salt, 64);
  return key.toString("hex");
}

async function userCanAccessFarm(userId, farmId) {
  const farm = await Farm.findById(farmId).lean();
  if (!farm) return { ok: false, status: 404, error: "Farm not found" };
  if (farm.ownerUserId === userId) return { ok: true, farm };
  const membership = await FarmMember.findOne({ farmId, userId }).lean();
  if (membership) return { ok: true, farm };
  return { ok: false, status: 403, error: "Forbidden" };
}

// Routes
app.post("/farms", auth, async (req, res) => {
  try {
    const { name, location, status, notes, data, identifier, accessCode } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const farmDoc = {
      ownerUserId: req.user.id,
      name,
      identifier,
      location,
      status,
      notes,
      data: data ?? {},
      history: [
        {
          change: { created: true },
          note: "Farm created",
          byUserId: req.user.id,
          at: new Date(),
        },
      ],
    };
    if (accessCode) {
      const salt = crypto.randomBytes(16).toString("hex");
      farmDoc.accessCodeSalt = salt;
      farmDoc.accessCodeHash = hashAccessCode(accessCode, salt);
    }
    const farm = await Farm.create(farmDoc);
    res.status(201).json(farm);
  } catch (e) {
    console.error(e);
    if (e?.code === 11000) {
      return res.status(409).json({ error: "identifier already exists" });
    }
    res.status(500).json({ error: "Failed to create farm" });
  }
});

app.get("/farms", auth, async (req, res) => {
  console.log("Listing farms for user:", req.user.id);
  try {
    const mine = String(req.query.mine || "0") === "1";
    const userId = req.user.id;
    if (mine) {
      const farms = await Farm.find({ ownerUserId: userId }).sort({ updatedAt: -1 }).lean();
      return res.json(farms);
    }
    // farms where user is owner or member
    const memberships = await FarmMember.find({ userId }).select("farmId").lean();
    const memberFarmIds = memberships.map((m) => m.farmId);
    const farms = await Farm.find({ $or: [{ ownerUserId: userId }, { _id: { $in: memberFarmIds } }] })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(farms);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list farms" });
  }
});

// Search farms by identifier (prefix) OR name (contains), case-insensitive
app.get("/farms/search", auth, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json([]);
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const startsWith = new RegExp("^" + escaped, "i");
    const contains = new RegExp(escaped, "i");
    const farms = await Farm.find({
      $or: [
        { identifier: { $regex: startsWith } },
        { name: { $regex: contains } }
      ]
    })
      .select("identifier name status updatedAt")
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();
    res.json(farms);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to search farms" });
  }
});

// Link to an existing farm by identifier + access code (AAC)
app.post("/farms/link", auth, async (req, res) => {
  try {
    const { identifier, accessCode } = req.body || {};
    if (!identifier || !accessCode) return res.status(400).json({ error: "identifier and accessCode required" });
    const farm = await Farm.findOne({ identifier }).lean();
    if (!farm) return res.status(404).json({ error: "Farm not found" });
    if (!farm.accessCodeSalt || !farm.accessCodeHash) return res.status(400).json({ error: "Farm is not linkable" });
    const computed = Buffer.from(hashAccessCode(accessCode, farm.accessCodeSalt), "hex");
    const stored = Buffer.from(farm.accessCodeHash, "hex");
    const match = computed.length === stored.length && crypto.timingSafeEqual(computed, stored);
    // Use 403 (Forbidden) instead of 401 to avoid client-wide logout on invalid code
    if (!match) return res.status(403).json({ error: "Invalid access code" });
    // Upsert membership
    await FarmMember.updateOne(
      { farmId: farm._id, userId: req.user.id },
      { $setOnInsert: { role: "viewer" } },
      { upsert: true }
    );
    res.json({ ok: true, farmId: farm._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to link farm" });
  }
});

app.get("/farms/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const access = await userCanAccessFarm(req.user.id, id);
    if (!access.ok) return res.status(access.status).json({ error: access.error });
    res.json(access.farm);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get farm" });
  }
});

app.patch("/farms/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const access = await userCanAccessFarm(req.user.id, id);
    if (!access.ok) return res.status(access.status).json({ error: access.error });
    const allowed = ["name", "location", "status", "notes", "data"];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No valid fields to update" });
    const farm = await Farm.findByIdAndUpdate(
      id,
      {
        $set: updates,
        $push: {
          history: {
            change: { set: updates },
            note: req.body.note || "Farm updated",
            byUserId: req.user.id,
            at: new Date(),
          },
        },
      },
      { new: true }
    );
    res.json(farm);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update farm" });
  }
});

app.post("/farms/:id/updates", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { change = {}, note = "" } = req.body || {};
    const access = await userCanAccessFarm(req.user.id, id);
    if (!access.ok) return res.status(access.status).json({ error: access.error });
    const farm = await Farm.findByIdAndUpdate(
      id,
      {
        $push: {
          history: {
            change,
            note,
            byUserId: req.user.id,
            at: new Date(),
          },
        },
      },
      { new: true }
    );
    res.json({ ok: true, history: farm.history });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to append update" });
  }
});

// Set or rotate a farm's access code (owner only)
app.patch("/farms/:id/access-code", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { accessCode } = req.body || {};
    if (!accessCode) return res.status(400).json({ error: "accessCode required" });
    const farm = await Farm.findById(id).lean();
    if (!farm) return res.status(404).json({ error: "Farm not found" });
    if (farm.ownerUserId !== req.user.id) return res.status(403).json({ error: "Only owner can set access code" });
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashAccessCode(accessCode, salt);
    await Farm.updateOne(
      { _id: id },
      {
        $set: { accessCodeSalt: salt, accessCodeHash: hash },
        $push: {
          history: {
            change: { accessCode: "rotated" },
            note: "Access code set/rotated",
            byUserId: req.user.id,
            at: new Date(),
          },
        },
      }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to set access code" });
  }
});

app.get("/farms/:id/history", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const access = await userCanAccessFarm(req.user.id, id);
    if (!access.ok) return res.status(access.status).json({ error: access.error });
    const farm = await Farm.findById(id).select("history").lean();
    res.json(farm?.history ?? []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get history" });
  }
});

// ---- Orders demo endpoint ----
// Returns a lightweight, role-agnostic set of orders for the mobile app
app.get("/data/orders", auth, async (req, res) => {
  try {
    const now = Date.now();
    const addDays = (d) => new Date(now + d * 86400000).toISOString();
    const statuses = ["preparing", "awaiting_pickup", "in_transit", "delayed", "delivered"];
    const partners = [
      "High Valley Farms",
      "Transborder Logistics",
      "Global Origins Ltd",
      "Harvest Markets",
      "Green Fields Collective"
    ];
    const destinations = ["Nairobi", "Mombasa", "Kampala", "Dar es Salaam", "Kigali"];

    const fmtCurrency = (n) => `USD ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    const orders = Array.from({ length: 8 }).map((_, i) => {
      const status = statuses[i % statuses.length];
      const dueOffset = i - 2; // some past, some future
      return {
        id: `ORD-${1000 + i}`,
        reference: `SO-${2025}${String(100 + i).padStart(3, "0")}`,
        partner: partners[i % partners.length],
        destination: destinations[(i * 2) % destinations.length],
        status,
        dueDate: addDays(dueOffset),
        quantity: `${50 + i * 5} crates`,
        value: fmtCurrency(2500 + i * 420),
        lastUpdated: addDays(-Math.min(i, 3)),
        highlights: [
          status === "delayed" ? "Carrier reported a delay due to weather" : "On schedule",
          i % 2 === 0 ? "QC passed at origin" : "Awaiting pickup confirmation"
        ]
      };
    });

    const summary = [
      { id: "total", label: "Total", value: String(orders.length) },
      { id: "in_transit", label: "In transit", value: String(orders.filter(o => o.status === "in_transit").length) },
      { id: "delayed", label: "Delayed", value: String(orders.filter(o => o.status === "delayed").length), helper: "Investigate causes" }
    ];

    res.json({ orders, summary });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

app.post("/farms/:id/members", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role = "viewer" } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });
    // Only owner can add members
    const farm = await Farm.findById(id).lean();
    if (!farm) return res.status(404).json({ error: "Farm not found" });
    if (farm.ownerUserId !== req.user.id) return res.status(403).json({ error: "Only owner can add members" });
    await FarmMember.updateOne(
      { farmId: id, userId },
      { $set: { role } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to add member" });
  }
});

app.listen(port, () => {
  console.log(`User service listening on ${port}`);
});
