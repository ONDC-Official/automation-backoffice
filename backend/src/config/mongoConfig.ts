import mongoose from "mongoose";
import { logInfo, logError } from "./winstonConfig";

// Connect to MongoDB. Called once on server start-up (after dotenv.config()).
export const connectMongo = async (): Promise<void> => {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/backoffice";
  try {
    await mongoose.connect(MONGO_URI);
    logInfo({ message: `Connected to MongoDB (${MONGO_URI})` });
  } catch (error: any) {
    logError({ message: "Failed to connect to MongoDB", error });
    throw error;
  }
};

export default mongoose;
