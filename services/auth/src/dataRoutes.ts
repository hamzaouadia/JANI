import { Router } from "express";

import { getFarms, linkFarm, getPartners, getOrders } from "./dataControllers";
import { authMiddleware } from "./middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/farms", getFarms);
router.post("/farms/:id/link", linkFarm);
router.get("/partners", getPartners);
router.get("/orders", getOrders);

export default router;
