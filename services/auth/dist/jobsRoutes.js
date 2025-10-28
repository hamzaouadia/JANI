"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("./middleware/authMiddleware");
const syncModels_1 = require("./syncModels");
const merkleModels_1 = require("./merkleModels");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get("/ping", (_req, res) => res.json({ ok: true }));
// Compute and store Merkle root for current user's owner for a given date (UTC)
router.post("/merkle/run", async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    const dateParam = req.query.date ?? req.body?.date;
    const date = dateParam ? new Date(dateParam) : new Date();
    const dayStart = (0, merkleModels_1.startOfDayUtc)(date);
    const dayEnd = (0, merkleModels_1.endOfDayUtc)(date);
    const events = await syncModels_1.SyncEvent.find({
        ownerRole: user.role,
        ownerIdentifier: user.identifier,
        occurredAt: { $gte: dayStart, $lte: dayEnd }
    })
        .sort({ seq: 1 })
        .select("_id seq occurredAt type");
    const leafs = events.map((e) => `${e._id}:${e.seq}`);
    const root = (0, merkleModels_1.simpleRoot)(leafs);
    const saved = await merkleModels_1.MerkleRoot.findOneAndUpdate({ ownerRole: user.role, ownerIdentifier: user.identifier, merkleDate: dayStart }, { rootHash: root, eventCount: events.length }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({
        ownerRole: saved.ownerRole,
        ownerIdentifier: saved.ownerIdentifier,
        merkleDate: saved.merkleDate,
        rootHash: saved.rootHash,
        eventCount: saved.eventCount
    });
});
exports.default = router;
