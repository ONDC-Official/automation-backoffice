import { Request, Response } from "express";
import { logError, logInfo } from "../config/winstonConfig";
import User from "../models/User";

const serialize = (u: any) => ({
  id: u._id,
  login: u.login,
  name: u.name,
  email: u.email,
  avatarUrl: u.avatarUrl,
  role: u.role,
  addedBy: u.addedBy,
  createdAt: u.createdAt,
});

// GET /admin/users — list all provisioned users.
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users.map(serialize));
  } catch (error: any) {
    logError({ message: "Error listing users", error });
    res.status(500).json({ message: "An error occurred." });
  }
};

// POST /admin/users — manually add a user by GitHub username.
// Body: { login, role?, name?, email? }
export const addUser = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user;
    const { login, role, name, email } = req.body || {};

    if (!login || typeof login !== "string" || !login.trim()) {
      res.status(400).json({ message: "GitHub username (login) is required." });
      return;
    }
    if (role && role !== "admin" && role !== "user") {
      res.status(400).json({ message: "Role must be 'admin' or 'user'." });
      return;
    }

    const cleanLogin = login.trim();
    const existing = await User.findOne({ login: cleanLogin });
    if (existing) {
      res.status(409).json({ message: "User already exists." });
      return;
    }

    const user = await User.create({
      login: cleanLogin,
      name: name?.trim() || cleanLogin,
      email: email?.trim(),
      role: role || "user",
      addedBy: admin?.login,
    });
    logInfo({ message: `User ${cleanLogin} added by ${admin?.login}` });
    res.status(201).json(serialize(user));
  } catch (error: any) {
    logError({ message: "Error adding user", error });
    res.status(500).json({ message: "An error occurred." });
  }
};

// PATCH /admin/users/:id/role — change a user's role. Body: { role }
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (role !== "admin" && role !== "user") {
      res.status(400).json({ message: "Role must be 'admin' or 'user'." });
      return;
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    user.role = role;
    await user.save();
    res.status(200).json(serialize(user));
  } catch (error: any) {
    logError({ message: "Error updating user role", error });
    res.status(500).json({ message: "An error occurred." });
  }
};

// DELETE /admin/users/:id — revoke a user's access.
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = (req as any).user;
    // Prevent an admin from removing their own access by mistake.
    if (admin?.id === id) {
      res.status(400).json({ message: "You cannot remove your own account." });
      return;
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    logInfo({ message: `User ${user.login} removed by ${admin?.login}` });
    res.status(200).json({ message: "User removed.", id });
  } catch (error: any) {
    logError({ message: "Error deleting user", error });
    res.status(500).json({ message: "An error occurred." });
  }
};
