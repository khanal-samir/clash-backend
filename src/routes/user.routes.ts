import { Router } from "express";
import {
  changePassword,
  checkLogin,
  forgotPassword,
  getUser,
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authLimit } from "../configs/ratelimit.js";

const router = Router();
router.use(authLimit);

router.get("/", authMiddleware, getUser);
router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/check-login", checkLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", changePassword);

export default router;
