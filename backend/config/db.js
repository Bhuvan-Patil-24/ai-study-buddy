import mongoose from "mongoose";
import { logger } from "../logger/logger.js";
import { printBanner } from "../utils/consoleLog.js";
import dotenv from 'dotenv';
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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
