import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

// Keep the same default as the existing middleware so tokens stay compatible.
// Read lazily so values from a local .env (loaded via dotenv) are picked up.
const getSecret = () => process.env.JWT_SECRET || "your_secret_key";
const getExpiry = () => process.env.JWT_EXPIRY || "8h";

export interface AuthTokenPayload {
  id: string;
  login: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role: string;
}

export const signUserToken = (user: IUser): string => {
  const payload: AuthTokenPayload = {
    id: String(user._id),
    login: user.login,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };
  return jwt.sign(payload, getSecret(), {
    expiresIn: getExpiry(),
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, getSecret()) as AuthTokenPayload;
};
