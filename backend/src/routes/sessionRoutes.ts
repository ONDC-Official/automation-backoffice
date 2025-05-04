// src/routes/sessionRoutes.ts

import { Router } from "express";
import {
  getSession,
  updateSession,
  deleteSession,
  updateCacheDb,
  getAllSession,
  createSession,
} from "../controllers/sessionController";
import validateToken from "../middleware";
import otelTracing from "../services/tracing-service";

const router = Router();

router.get("/all", validateToken, getAllSession);
router.get("/", otelTracing('','','query.subscriber_url'),validateToken, getSession);
router.put("/",otelTracing('','','query.subscriber_url'), validateToken, updateSession);
router.delete("/",otelTracing('','','query.subscriber_url'), validateToken, deleteSession);
router.post("/",otelTracing('','body.sessionID'), createSession);
router.post("/updatedb", updateCacheDb);

export default router;
