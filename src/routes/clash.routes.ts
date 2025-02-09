import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  deleteClash,
  getClash,
  getClashByID,
  postClash,
  updateClash,
} from "../controllers/clash.controller.js";
import { addClashItems } from "../controllers/clashItems.controller.js";

const router = Router();
// router.use(authMiddleware);
router.post("/", authMiddleware, postClash);
router.get("/", authMiddleware, getClash);
router.get("/:id", getClashByID);
router.put("/:id", authMiddleware, updateClash);
router.delete("/:id", authMiddleware, deleteClash);

//clash items routes
router.post("/items", addClashItems);
export default router;
