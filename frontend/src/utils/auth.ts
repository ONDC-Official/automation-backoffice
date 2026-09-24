// Shape stored under localStorage["userData"]. Keeps `token` for backward
// compatibility with existing requests, plus the decoded profile fields.
export interface StoredUser {
  token: string;
  id?: string;
  login?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: "admin" | "user";
  exp?: number;
}

// Decode a JWT payload without verifying the signature (display only).
export const decodeToken = (token: string): Record<string, any> | null => {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const storeToken = (token: string): StoredUser => {
  const payload = decodeToken(token) || {};
  const user: StoredUser = { token, ...payload };
  localStorage.setItem("userData", JSON.stringify(user));
  return user;
};

export const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem("userData");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getStoredUser();
  if (!user?.token) return false;
  // Treat expired tokens as logged out.
  if (user.exp && Date.now() >= user.exp * 1000) return false;
  return true;
};

export const isAdmin = (): boolean => getStoredUser()?.role === "admin";

export const logout = () => {
  localStorage.removeItem("userData");
};
