import { Router } from "express";
import { authMiddleware, type AuthenticatedRequest } from "./middleware/authMiddleware";
import { SyncEvent } from "./syncModels";
import { MerkleRoot, startOfDayUtc, endOfDayUtc, simpleRoot } from "./merkleModels";

const router = Router();

router.use(authMiddleware);

router.get("/ping", (_req, res) => res.json({ ok: true }));

// Compute and store Merkle root for current user's owner for a given date (UTC)
router.post("/merkle/run", async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const dateParam = (req.query.date as string | undefined) ?? (req.body?.date as string | undefined);
  const date = dateParam ? new Date(dateParam) : new Date();
  const dayStart = startOfDayUtc(date);
  const dayEnd = endOfDayUtc(date);

  const events = await SyncEvent.find({
    ownerRole: user.role,
    ownerIdentifier: user.identifier,
    occurredAt: { $gte: dayStart, $lte: dayEnd }
  })
    .sort({ seq: 1 })
    .select("_id seq occurredAt type");

  const leafs = events.map((e) => `${e._id}:${e.seq}`);
  const root = simpleRoot(leafs);

  const saved = await MerkleRoot.findOneAndUpdate(
    { ownerRole: user.role, ownerIdentifier: user.identifier, merkleDate: dayStart },
    { rootHash: root, eventCount: events.length },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.json({
    ownerRole: saved.ownerRole,
    ownerIdentifier: saved.ownerIdentifier,
    merkleDate: saved.merkleDate,
    rootHash: saved.rootHash,
    eventCount: saved.eventCount
  });
});

export default router;
