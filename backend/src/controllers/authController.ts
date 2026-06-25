import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {logError, logInfo} from "../config/winstonConfig";

// Secret key for JWT
const JWT_SECRET = "your_secret_key"; // Replace with a secure key in production

// Mock user data (Replace with database queries in production)
const mockUser = {
  username: "admin",
  password: "admin", // bcrypt hash for "password123"
};

// Login controller
export const login = async (req: Request, res: Response) => {
  logInfo({message: `Entering Login Funcion`});
  const { username, password } = req.body;
  // Validate input
  if (!username || !password) {
    logInfo({message: `Exiting Login Funcion`});
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    if (username !== mockUser.username) {
    logInfo({message: `Exiting Login Funcion`});
      res.status(401).json({ message: "Invalid username or password." });
      return;
    }

    if (password !== mockUser.password) {
    logInfo({message: `Exiting Login Funcion`});
      res.status(401).json({ message: "Invalid username or password." });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ username: mockUser.username }, JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });
    logInfo({message: `Exiting Login Funcion`});
    // Send token in response
    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    logError({message: "Error in Login Function",error });
    res.status(500).json({ message: "An error occurred during login." });
  }
};
