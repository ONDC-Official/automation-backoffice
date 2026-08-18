import { Request, Response, NextFunction } from "express";
import { logInfo, logError } from "../config/winstonConfig";
import { verifyToken } from "../utils/jwt";

// Middleware for token validation. Attaches the decoded payload to req.user.
const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logInfo({ message: `Entering Token Validation Middleware` });
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logInfo({ message: `Exiting Token Validation Middleware` });
    res
      .status(401)
      .json({ message: "Unauthorized: Token is missing or invalid." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    logInfo({ message: `Exiting Token Validation Middleware` });
    next();
  } catch (error) {
    logError({ message: "Token validation error", error });
    res.status(403).json({ message: "Forbidden: Invalid or expired token." });
  }
};

// Requires the authenticated user to be an admin.
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admin access required." });
    return;
  }
  next();
};

export default validateToken;
