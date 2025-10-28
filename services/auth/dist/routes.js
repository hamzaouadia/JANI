"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("./controllers");
const authMiddleware_1 = require("./middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/signup", controllers_1.signup);
router.post("/login", controllers_1.login);
router.post("/verify", authMiddleware_1.authMiddleware, (_req, res) => {
    res.json({ valid: true, user: _req.user });
});
router.get("/me", authMiddleware_1.authMiddleware, controllers_1.me);
exports.default = router;
