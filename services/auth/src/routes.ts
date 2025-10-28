import { Router } from "express";
import { signup, login, me } from "./controllers";
import { authMiddleware, AuthenticatedRequest } from "./middleware/authMiddleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", authMiddleware, (_req: AuthenticatedRequest, res) => {
  res.json({ valid: true, user: _req.user });
});
router.get("/me", authMiddleware, me);
export default router;
