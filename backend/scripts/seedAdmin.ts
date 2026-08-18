/**
 * Seed an admin user directly into MongoDB.
 *
 * The admin is keyed by their GitHub username (login). On their first GitHub
 * login the OAuth callback matches this record by login, fills in the githubId,
 * and preserves role=admin. The admin can then add other users from the UI.
 *
 * Usage:
 *   ADMIN_GITHUB_LOGIN=your-github-username npm run seed:admin
 *   ADMIN_GITHUB_LOGIN=your-github-username ADMIN_NAME="Full Name" \
 *     ADMIN_EMAIL=you@example.com npm run seed:admin
 */
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User";

dotenv.config();

const run = async () => {
  const login = process.env.ADMIN_GITHUB_LOGIN;
  if (!login) {
    console.error("ADMIN_GITHUB_LOGIN env var is required.");
    process.exit(1);
  }

  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/backoffice";
  await mongoose.connect(MONGO_URI);

  const update = {
    login,
    name: process.env.ADMIN_NAME || login,
    email: process.env.ADMIN_EMAIL,
    role: "admin" as const,
  };

  const user = await User.findOneAndUpdate({ login }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  console.log(`Seeded admin '${user.login}' (role=${user.role}).`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
