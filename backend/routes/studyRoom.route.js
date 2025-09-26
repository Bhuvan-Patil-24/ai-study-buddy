import { Router } from "express";
import { StudyRoomController } from "../controllers/studyRoom.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class StudyRoomRoutes {
  constructor() {
    this.router = Router();
    this.controller = new StudyRoomController();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  setupRoutes() {
    // Apply authentication middleware to all routes
    this.router.use(this.authMiddleware.isAuthenticated.bind(this.authMiddleware));

    // Room management
    this.router.post(
      "/",
      this.controller.createRoom.bind(this.controller)
    );

    this.router.get(
      "/",
      this.controller.getRooms.bind(this.controller)
    );

    this.router.get(
      "/:roomId",
      this.controller.getRoomById.bind(this.controller)
    );

    this.router.delete(
      "/:roomId",
      this.controller.deleteRoom.bind(this.controller)
    );

    // Room membership
    this.router.post(
      "/:roomId/join",
      this.controller.joinRoom.bind(this.controller)
    );

    this.router.post(
      "/:roomId/leave",
      this.controller.leaveRoom.bind(this.controller)
    );

    // Messaging
    this.router.post(
      "/:roomId/messages",
      this.controller.sendMessage.bind(this.controller)
    );

    this.router.get(
      "/:roomId/messages",
      this.controller.getMessages.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}
