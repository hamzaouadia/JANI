"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("./middleware/authMiddleware");
const syncModels_1 = require("./syncModels");
const media_1 = require("./media");
const router = (0, express_1.Router)();
// Protect all /sync routes
router.use(authMiddleware_1.authMiddleware);
router.post("/push", async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    // debug: inspect payload shape
    console.log("/sync/push body", JSON.stringify(req.body));
    const { events } = (req.body ?? {});
    if (!Array.isArray(events)) {
        return res.status(400).json({ error: "Invalid payload: events[] required" });
    }
    const results = [];
    let lastSeq = 0;
    const mediaPresigned = [];
    try {
        for (const evt of events) {
            try {
                const seq = await (0, syncModels_1.nextSequence)("serverSeq");
                lastSeq = seq;
                const created = await syncModels_1.SyncEvent.create({
                    ownerRole: user.role,
                    ownerIdentifier: user.identifier,
                    clientId: evt.clientId,
                    type: evt.type,
                    actorRole: user.role,
                    payload: evt.payload ?? {},
                    occurredAt: new Date(evt.occurredAt),
                    seq
                });
                // If event carries media declarations, prepare presigned uploads
                if (Array.isArray(evt.media) && evt.media.length) {
                    const presigned = await (0, media_1.prepareUploads)(evt.media.map((m) => ({
                        clientId: m.clientId,
                        checksum: m.checksum,
                        size: m.size,
                        mimeType: m.mimeType || (m.type === "photo" ? "image/jpeg" : "application/octet-stream")
                    })));
                    mediaPresigned.push(...presigned);
                }
                results.push({ clientId: evt.clientId, status: "success", serverId: created._id.toString() });
            }
            catch (err) {
                // Duplicate clientId for this owner -> conflict
                const message = err instanceof Error ? err.message : String(err);
                console.error("/sync/push error:", err);
                const code = err?.code;
                if (code === 11000 || /E11000|duplicate key/i.test(message)) {
                    results.push({ clientId: evt.clientId, status: "conflict", error: "Duplicate clientId" });
                }
                else {
                    results.push({ clientId: evt.clientId, status: "rejected", error: message || "Failed to store event" });
                }
            }
        }
    }
    catch (_error) {
        console.error("/sync/push batch failure", _error);
        return res.status(500).json({ error: "Failed to process batch" });
    }
    return res.json({
        serverSeq: lastSeq,
        results,
        mediaPresigned
    });
});
router.post("/commit", async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    // For MVP stub, accept commit and return 200. Future: mark events/media as committed.
    return res.json({ ok: true });
});
router.post("/media/:id/complete", async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    // Stub endpoint – would validate ownership and mark media uploaded.
    return res.json({ ok: true });
});
router.get("/", (_req, res) => res.json({ ok: true }));
router.get("/pull", async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    const sinceParam = req.query.since;
    const since = sinceParam ? Number(sinceParam) : null;
    const filter = {
        ownerRole: user.role,
        ownerIdentifier: user.identifier
    };
    if (since !== null && !Number.isNaN(since)) {
        filter.seq = { $gt: since };
    }
    const events = await syncModels_1.SyncEvent.find(filter).sort({ seq: 1 }).limit(200);
    const serverSeq = events.length ? events[events.length - 1].seq : (since ?? 0);
    return res.json({
        serverSeq,
        events: events.map((evt) => ({
            id: evt._id.toString(),
            type: evt.type,
            payload: evt.payload ?? {},
            occurredAt: evt.occurredAt.toISOString(),
            actorRole: evt.actorRole ?? user.role
        }))
    });
});
exports.default = router;
