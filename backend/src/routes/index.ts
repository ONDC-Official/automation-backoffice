import { Router } from "express";
import sessionRoutes from "./sessionRoutes"; // Import session-related routes
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));

// Mount session-related routes
router.use("/sessions", sessionRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
