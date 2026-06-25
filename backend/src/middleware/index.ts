import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logInfo, logError, logDebug } from "../config/winstonConfig";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable in production

// Middleware for token validation
const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get the token from the Authorization header
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
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the decoded payload to the request object for further use
    // req.user = decoded;
    logInfo({ message: `Exiting Token Validation Middleware`});
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    logError({ message: "Token validation error", error });
    res.status(403).json({ message: "Forbidden: Invalid or expired token." });
  }
};

export default validateToken;
