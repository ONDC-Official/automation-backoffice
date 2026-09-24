import { Router } from "express";
import { githubLogin, githubCallback, me } from "../controllers/authController";
import validateToken from "../middleware/index";

const router = Router();

// GitHub OAuth flow
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

// Current authenticated user
router.get("/me", validateToken, me);

export default router;
