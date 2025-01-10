// src/routes/sessionRoutes.ts

import { Router } from "express";
import {
  getSession,
  updateSession,
  deleteSession,
  updateCacheDb,
} from "../controllers/sessionController";
import validateToken from "../middleware";

const router = Router();

router.get("/", validateToken, getSession);
router.put("/", validateToken, updateSession);
router.delete("/", validateToken, deleteSession);
router.post("/updatedb", validateToken, updateCacheDb);

export default router;
