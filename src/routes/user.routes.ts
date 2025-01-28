import { Router } from "express";
import { registerUser, verifyEmail } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);

export default router;
