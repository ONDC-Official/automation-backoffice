import { Router } from "express";
import sessionRoutes from "./sessionRoutes"; // Import session-related routes
import { login } from "../controllers/authController";
import authRoutes from "./authRoutes";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));

// Mount session-related routes
router.use("/sessions", sessionRoutes);
router.use("/auth", authRoutes);

export default router;
