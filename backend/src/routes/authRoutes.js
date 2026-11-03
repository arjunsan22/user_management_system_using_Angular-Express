import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/auth/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);

export default router;