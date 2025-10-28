import { Router } from "express";
import { authMiddleware, type AuthenticatedRequest } from "./middleware/authMiddleware";
import { prepareUploads, type PrepareFile } from "./media";

const router = Router();

// Protect all /media routes
router.use(authMiddleware);

router.post("/prepare", async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as { files?: Array<{ checksum: string; size: number; mime_type: string; clientId?: string }> };
  const files = (body.files ?? []).map((f) => ({
    clientId: f.clientId ?? Math.random().toString(36).slice(2),
    checksum: f.checksum,
    size: f.size,
    mimeType: f.mime_type
  })) as PrepareFile[];

  if (!files.length) return res.status(400).json({ error: "files[] required" });

  const uploads = await prepareUploads(files);
  return res.json({ uploads });
});

export default router;
