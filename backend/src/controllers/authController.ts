import jwt from "jsonwebtoken";
import { Request, Response } from "express";

// Secret key for JWT
const JWT_SECRET = "your_secret_key"; // Replace with a secure key in production

// Mock user data (Replace with database queries in production)
const mockUser = {
  username: "admin",
  password: "admin", // bcrypt hash for "password123"
};

// Login controller
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  try {
    console.log(username, mockUser.username);
    if (username !== mockUser.username) {
      res.status(401).json({ message: "Invalid username or password." });
      return;
    }

    console.log(password, mockUser.password);
    if (password !== mockUser.password) {
      res.status(401).json({ message: "Invalid username or password." });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ username: mockUser.username }, JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    // Send token in response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};
