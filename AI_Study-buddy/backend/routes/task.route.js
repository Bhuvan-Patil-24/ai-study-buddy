import express from "express";
import { TaskController } from "../controllers/task.controller.js";
import { CreateTaskDto } from "../dtos/task.dto.js";
import { validateDto } from "../middlewares/validateDto.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class TaskRoutes {
  constructor() {
    this.router = express.Router();
    this.taskController = new TaskController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/team/:teamId",
      this.authMiddleware.isAuthenticated,
      validateDto(CreateTaskDto),
      this.taskController.createTask
    );

    this.router.get(
      "/team/:teamId",
      this.authMiddleware.isAuthenticated,
      this.taskController.getTeamTasks
    );

    this.router.get(
      "/my-tasks",
      this.authMiddleware.isAuthenticated,
      this.taskController.getMyTasks
    );

    this.router.get(
      "/:taskId",
      this.authMiddleware.isAuthenticated,
      this.taskController.getTask
    );

    this.router.patch(
      "/:taskId/status",
      this.authMiddleware.isAuthenticated,
      this.taskController.updateTaskStatus
    );
  }

  getRouter() {
    return this.router;
  }
}
