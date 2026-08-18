import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  githubId?: string;
  login: string; // GitHub username, the identifier the admin provisions
  name?: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
  addedBy?: string; // login of the admin who added this user
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    // Sparse + unique so a seeded admin without a githubId yet does not clash.
    githubId: { type: String, unique: true, sparse: true },
    login: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    addedBy: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
export default User;
