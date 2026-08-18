import { Request, Response } from "express";
import axios from "axios";
import { logError, logInfo } from "../config/winstonConfig";
import User from "../models/User";
import { signUserToken } from "../utils/jwt";

// Read config lazily so values from a local .env (loaded via dotenv) are used.
const cfg = () => ({
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  callbackUrl:
    process.env.GITHUB_CALLBACK_URL ||
    "http://localhost:5002/auth/github/callback",
  // Where the browser is sent back to after auth (the backoffice frontend).
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
});
const GITHUB_SCOPE = "read:user user:email";

// Step 1 — redirect the user to GitHub's authorize page.
export const githubLogin = async (_req: Request, res: Response) => {
  const { clientId, callbackUrl } = cfg();
  if (!clientId) {
    res.status(500).json({ message: "GitHub OAuth is not configured." });
    return;
  }
  const authorizeUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
    `&scope=${encodeURIComponent(GITHUB_SCOPE)}` +
    `&allow_signup=false`;
  logInfo({ message: "Redirecting to GitHub authorize" });
  res.redirect(authorizeUrl);
};

// Step 2 — GitHub redirects back here with a temporary code.
export const githubCallback = async (req: Request, res: Response) => {
  const { clientId, clientSecret, callbackUrl, frontendUrl } = cfg();
  const code = req.query.code as string | undefined;
  if (!code) {
    res.redirect(`${frontendUrl}/login?error=missing_code`);
    return;
  }

  try {
    // Exchange the code for an access token.
    const tokenResp = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResp.data?.access_token;
    if (!accessToken) {
      logError({ message: "GitHub token exchange failed", error: tokenResp.data });
      res.redirect(`${frontendUrl}/login?error=token_exchange_failed`);
      return;
    }

    // Fetch the GitHub profile.
    const ghHeaders = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    };
    const profileResp = await axios.get("https://api.github.com/user", {
      headers: ghHeaders,
    });
    const profile = profileResp.data;

    // Email can be null on the profile; pull the primary verified one.
    let email: string | undefined = profile.email;
    if (!email) {
      try {
        const emailsResp = await axios.get(
          "https://api.github.com/user/emails",
          { headers: ghHeaders }
        );
        const primary = (emailsResp.data || []).find(
          (e: any) => e.primary && e.verified
        );
        email = primary?.email;
      } catch (e) {
        logError({ message: "Failed to fetch GitHub emails", error: e });
      }
    }

    const githubId = String(profile.id);
    const login = profile.login as string;

    // Access is limited to users the admin has pre-added. Match by githubId
    // first, then by login (for records added before the first login).
    const user =
      (await User.findOne({ githubId })) ||
      (await User.findOne({ login }));

    if (!user) {
      // Not provisioned by an admin — deny access.
      logInfo({ message: `Login denied for un-provisioned user: ${login}` });
      res.redirect(
        `${frontendUrl}/login?error=not_authorized&login=${encodeURIComponent(
          login
        )}`
      );
      return;
    }

    // Refresh profile fields on the existing record.
    user.githubId = githubId;
    user.name = profile.name || user.name || login;
    if (email) user.email = email;
    user.avatarUrl = profile.avatar_url || user.avatarUrl;
    await user.save();

    const token = signUserToken(user);
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error: any) {
    logError({ message: "Error in GitHub OAuth callback", error });
    res.redirect(`${frontendUrl}/login?error=oauth_error`);
  }
};

// Returns the current authenticated user's profile (from the DB, fresh).
export const me = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const user = await User.findById(authUser?.id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json({
      id: user._id,
      login: user.login,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch (error: any) {
    logError({ message: "Error in /auth/me", error });
    res.status(500).json({ message: "An error occurred." });
  }
};
