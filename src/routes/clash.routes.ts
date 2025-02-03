import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  deleteClash,
  getClash,
  getClashByID,
  postClash,
  updateClash,
} from "../controllers/clash.controller.js";

const router = Router();
router.use(authMiddleware);
router.post("/", postClash);
router.get("/", getClash);
router.get("/:id", getClashByID);
router.put("/:id", updateClash);
router.delete("/:id", deleteClash);
export default router;
