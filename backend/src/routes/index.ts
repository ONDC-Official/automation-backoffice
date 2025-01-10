import { Router } from "express";
import sessionRoutes from "./sessionRoutes"; // Import session-related routes
import { login } from "../controllers/authController";
import authRoutes from "./authRoutes";

const router = Router();

// Mount session-related routes
router.use("/sessions", sessionRoutes);
router.use("/auth", authRoutes);

export default router;
