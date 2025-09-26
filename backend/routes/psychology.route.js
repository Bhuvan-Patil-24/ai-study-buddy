import { Router } from "express";
import { PsychologyController } from "../controllers/psychology.controller.js";
import { PsychologyTestDto } from "../dtos/psychology.dto.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { validateDto } from "../middlewares/validateDto.js";

export class PsychologyRoutes {
  constructor() {
    this.router = Router();
    this.controller = new PsychologyController();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  setupRoutes() {
    // Apply authentication middleware to all routes
    this.router.use(this.authMiddleware.isAuthenticated.bind(this.authMiddleware));

    // Submit psychology test
    this.router.post(
      "/submit",
      validateDto(PsychologyTestDto),
      this.controller.submitTest.bind(this.controller)
    );

    // Get today's test status
    this.router.get(
      "/today-status",
      this.controller.getTodayStatus.bind(this.controller)
    );

    // Get user's test history
    this.router.get(
      "/history",
      this.controller.getTestHistory.bind(this.controller)
    );

    // Get stress trends
    this.router.get(
      "/trends",
      this.controller.getStressTrends.bind(this.controller)
    );

    // Admin only - Get all users' psychology data
    this.router.get(
      "/admin/all-data",
      this.controller.getAllUsersData.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}
