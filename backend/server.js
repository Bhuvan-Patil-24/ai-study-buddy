import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { logger } from './logger/logger.js';
import { printBanner } from './utils/consoleLog.js';
import { studyRoomController } from './controllers/studyRoom.controller.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST"]
  }
});

// Setup socket handlers
io.on("connection", (socket) => {
  logger.info(`New client connected: ${socket.id}`);
  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    logger.info(`Client ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Pass socket.io instance to controller
studyRoomController.setSocketIO(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    printBanner("✅ Server Started", `🌐 Listening at: http://localhost:${PORT}`);
  });
});
