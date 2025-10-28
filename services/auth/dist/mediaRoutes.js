"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("./middleware/authMiddleware");
const media_1 = require("./media");
const router = (0, express_1.Router)();
// Protect all /media routes
router.use(authMiddleware_1.authMiddleware);
router.post("/prepare", async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthorized" });
    const body = req.body;
    const files = (body.files ?? []).map((f) => ({
        clientId: f.clientId ?? Math.random().toString(36).slice(2),
        checksum: f.checksum,
        size: f.size,
        mimeType: f.mime_type
    }));
    if (!files.length)
        return res.status(400).json({ error: "files[] required" });
    const uploads = await (0, media_1.prepareUploads)(files);
    return res.json({ uploads });
});
exports.default = router;
