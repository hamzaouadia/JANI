"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const dataRoutes_1 = __importDefault(require("./dataRoutes"));
const syncRoutes_1 = __importDefault(require("./syncRoutes"));
const mediaRoutes_1 = __importDefault(require("./mediaRoutes"));
const jobsRoutes_1 = __importDefault(require("./jobsRoutes"));
const database_1 = require("./database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const allowOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : undefined;
const corsOptions = {
    origin: allowOrigin,
    credentials: true
};
app.use((req, res, next) => {
    const origin = req.header("Origin");
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    else {
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Health check endpoint
app.get("/health", (_req, res) => {
    const mongoStatus = mongoose_1.default.connection.readyState;
    const mongoStates = {
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
app.use("/auth", routes_1.default);
app.use("/data", dataRoutes_1.default);
app.use("/sync", syncRoutes_1.default);
app.use("/media", mediaRoutes_1.default);
// Debug: direct ping routes to verify mount
app.get("/pingroot", (_req, res) => res.json({ ok: true, src: "index" }));
app.get("/jobs/pingroot", (_req, res) => res.json({ ok: true, src: "index/jobs" }));
app.use("/jobs", jobsRoutes_1.default);
console.log("🔗 /sync routes registered");
(0, database_1.connectDatabase)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Auth service running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ Failed to start auth service:", err);
    process.exit(1);
});
