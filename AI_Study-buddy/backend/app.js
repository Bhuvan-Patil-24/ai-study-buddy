import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import routes and middleware
import { ContactRoutes } from "./routes/contact.route.js";
import { AuthRoutes } from "./routes/auth.route.js";
// import { DocumentRoutes } from "./routes/document.route.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { TeamRoutes } from "./routes/team.route.js";
import { TaskRoutes } from "./routes/task.route.js";
import { QuizRoutes } from "./routes/quiz.routes.js";
import { ChatRoutes } from "./routes/chat.route.js";0

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url))
);

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: true, // Reflect the request origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.get("/api/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  let dbStatus = "disconnected";
  switch (dbState) {
    case 0:
      dbStatus = "disconnected";
      break;
    case 1:
      dbStatus = "connected";
      break;
    case 2:
      dbStatus = "connecting";
      break;
    case 3:
      dbStatus = "disconnecting";
      break;
  }

  res.status(200).json({
    status: dbState === 1 ? "OK" : "Degraded",
    message: "Server is healthy",
    version: pkg.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
  });
});

// routes main point handling

app.use("/api/v1/auth", new AuthRoutes().getRouter());
app.use("/api/v2/contact", new ContactRoutes().getRouter());
// app.use("/api/v3/documents", new DocumentRoutes().getRouter());
app.use("/api/v4/teams", new TeamRoutes().getRouter());
app.use("/api/v5/tasks", new TaskRoutes().getRouter());
app.use("/api/v6/quiz", new QuizRoutes().getRouter());
app.use("/api/v7/chat", new ChatRoutes().getRouter());

app.use(errorHandler);

export default app;
