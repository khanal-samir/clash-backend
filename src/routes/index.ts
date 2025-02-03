import userRoutes from "./user.routes.js";
import clashRoutes from "./clash.routes.js";
import { Router } from "express";

const router = Router();
router.use("/api/user", userRoutes);
router.use("/api/clash", clashRoutes);

export default router;
