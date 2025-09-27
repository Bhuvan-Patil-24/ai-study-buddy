import mongoose from "mongoose";
import { logger } from "../logger/logger.js";
import { printBanner } from "../utils/consoleLog.js";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    logger.info(`Attempting to connect to MongoDB with URI: ${mongoURI}`);
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);

    logger.info("MongoDB Connected");
    printBanner("✅ MongoDB Connected", "📦 Connected to database successfully");
  } catch (err) {
    logger.error(`MongoDB Error: ${err.message}`);
    console.error('\x1b[31m%s\x1b[0m', `❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};
