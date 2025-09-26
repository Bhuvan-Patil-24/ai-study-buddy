import mongoose from "mongoose";
import { logger } from "../logger/logger.js";
import { printBanner } from "../utils/consoleLog.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB Connected");
    printBanner("✅ MongoDB Connected", "📦 Connected to database successfully");
  } catch (err) {
    logger.error(`MongoDB Error: ${err.message}`);
    console.error('\x1b[31m%s\x1b[0m', `❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};
