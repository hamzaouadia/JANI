import { Router } from "express";
import type { AuthenticatedRequest } from "./middleware/authMiddleware";
import { authMiddleware } from "./middleware/authMiddleware";
import { SyncEvent, nextSequence } from "./syncModels";
import { prepareUploads } from "./media";

const router = Router();

// Protect all /sync routes
router.use(authMiddleware);

router.post("/push", async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // debug: inspect payload shape
  console.log("/sync/push body", JSON.stringify(req.body));
  const { events } = (req.body ?? {}) as {
    clientSeq?: number;
    deviceId?: string;
    events?: Array<{
      clientId: string;
      type: string;
      occurredAt: string;
      payload: unknown;
      media?: Array<{ clientId: string; checksum: string; size: number; type: string; mimeType?: string }>;
    }>;
  };

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "Invalid payload: events[] required" });
  }

  const results: Array<{ clientId: string; status: "success" | "conflict" | "rejected"; serverId?: string; error?: string }> = [];
  let lastSeq = 0;
  const mediaPresigned: Array<{ id: string; clientId: string; uploadUrl: string; method: string; headers: Record<string, string> }> = [];

  try {
    for (const evt of events) {
      try {
        const seq = await nextSequence("serverSeq");
        lastSeq = seq;

        const created = await SyncEvent.create({
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
          const presigned = await prepareUploads(
            evt.media.map((m) => ({
              clientId: m.clientId,
              checksum: m.checksum,
              size: m.size,
              mimeType: m.mimeType || (m.type === "photo" ? "image/jpeg" : "application/octet-stream")
            }))
          );
          mediaPresigned.push(...presigned);
        }

        results.push({ clientId: evt.clientId, status: "success", serverId: created._id.toString() });
      } catch (err) {
        // Duplicate clientId for this owner -> conflict
        const message = err instanceof Error ? err.message : String(err);
         
        console.error("/sync/push error:", err);
        const code = (err as any)?.code;
        if (code === 11000 || /E11000|duplicate key/i.test(message)) {
          results.push({ clientId: evt.clientId, status: "conflict", error: "Duplicate clientId" });
        } else {
          results.push({ clientId: evt.clientId, status: "rejected", error: message || "Failed to store event" });
        }
      }
    }
  } catch (_error) {
    console.error("/sync/push batch failure", _error);
    return res.status(500).json({ error: "Failed to process batch" });
  }

  return res.json({
    serverSeq: lastSeq,
    results,
    mediaPresigned
  });
});

router.post("/commit", async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // For MVP stub, accept commit and return 200. Future: mark events/media as committed.
  return res.json({ ok: true });
});

router.post("/media/:id/complete", async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // Stub endpoint – would validate ownership and mark media uploaded.
  return res.json({ ok: true });
});

router.get("/", (_req, res) => res.json({ ok: true }));

router.get("/pull", async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const sinceParam = req.query.since as string | undefined;
  const since = sinceParam ? Number(sinceParam) : null;

  const filter: Record<string, unknown> = {
    ownerRole: user.role,
    ownerIdentifier: user.identifier
  };
  if (since !== null && !Number.isNaN(since)) {
    filter.seq = { $gt: since };
  }

  const events = await SyncEvent.find(filter).sort({ seq: 1 }).limit(200);
  const serverSeq = events.length ? events[events.length - 1]!.seq : (since ?? 0);

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

export default router;
