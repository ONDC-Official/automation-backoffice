import { Router } from "express";
import {
  listUsers,
  addUser,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController";
import validateToken, { requireAdmin } from "../middleware/index";

const router = Router();

// All admin routes require a valid token AND an admin role.
router.use(validateToken, requireAdmin);

router.get("/users", listUsers);
router.post("/users", addUser);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
