import { Router } from "express";
import {
  getUser,
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/", authMiddleware, getUser);
router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);

export default router;
