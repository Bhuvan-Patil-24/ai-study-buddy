import { Router } from "express";
import { AIController } from "../controllers/ai.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class AIRoutes {
  constructor() {
    this.router = Router();
    this.controller = new AIController();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  setupRoutes() {
    // Apply authentication middleware to all routes
    this.router.use(this.authMiddleware.isAuthenticated.bind(this.authMiddleware));

    // Study room AI features
    this.router.post(
      "/study-rooms/:roomId/summary",
      this.controller.generateStudyRoomSummary.bind(this.controller)
    );

    // Note processing
    this.router.post(
      "/notes/process",
      this.controller.processNoteContent.bind(this.controller)
    );

    // User notes management
    this.router.get(
      "/notes",
      this.controller.getUserNotes.bind(this.controller)
    );

    this.router.get(
      "/notes/:noteId",
      this.controller.getNoteById.bind(this.controller)
    );

    // Motivational messages
    this.router.post(
      "/motivational-message",
      this.controller.getMotivationalMessage.bind(this.controller)
    );

    // Stress level analysis
    this.router.post(
      "/stress-analysis",
      this.controller.analyzeStressLevel.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}
