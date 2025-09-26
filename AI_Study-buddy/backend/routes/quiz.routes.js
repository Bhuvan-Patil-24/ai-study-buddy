import express from "express";
import { QuizController } from "../controllers/quiz.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { validateDto } from "../middlewares/validateDto.js";
import {
  CreateQuizDto,
  UpdateQuizDto,
  AssignUsersDto,
} from "../dtos/quiz.dto.js";
import { CreateQuestionDto, UpdateQuestionDto } from "../dtos/question.dto.js";

export class QuizRoutes {
  constructor() {
    this.router = express.Router();
    this.quizController = new QuizController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Admin Quiz Management
    this.router.post(
      "/admin/quizzes",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(CreateQuizDto),
      this.quizController.createQuiz
    );

    this.router.put(
      "/admin/quizzes/:quizId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(UpdateQuizDto),
      this.quizController.updateQuiz
    );

    this.router.delete(
      "/admin/quizzes/:quizId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      this.quizController.deleteQuiz
    );

    this.router.get(
      "/admin/quizzes",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      this.quizController.getAdminQuizzes
    );

    this.router.get(
      "/admin/quizzes/:quizId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      this.quizController.getQuizDetailsForAdmin
    );

    this.router.post(
      "/admin/quizzes/:quizId/assign",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(AssignUsersDto),
      this.quizController.assignUsersToQuiz
    );

    // Admin Question Management
    this.router.post(
      "/admin/quizzes/:quizId/questions",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(CreateQuestionDto),
      this.quizController.addQuestion
    );

    this.router.put(
      "/admin/quizzes/:quizId/questions/:questionId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(UpdateQuestionDto),
      this.quizController.updateQuestion
    );

    this.router.delete(
      "/admin/quizzes/:quizId/questions/:questionId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      this.quizController.deleteQuestion
    );

    // User Quiz Attempt
    this.router.get(
      "/user/quizzes",
      this.authMiddleware.isAuthenticated,
      this.quizController.getUserAssignedQuizzes
    );

    this.router.post(
      "/user/quizzes/:quizId/start",
      this.authMiddleware.isAuthenticated,
      this.quizController.startQuiz
    );

    this.router.get(
      "/user/quizzes/:quizId/current-question",
      this.authMiddleware.isAuthenticated,
      this.quizController.getCurrentQuestion
    );

    this.router.post(
      "/user/quizzes/:quizId/answer",
      this.authMiddleware.isAuthenticated,
      this.quizController.submitAnswer
    );

    this.router.get(
      "/user/quizzes/:quizId/result",
      this.authMiddleware.isAuthenticated,
      this.quizController.getQuizResult
    );

    // Admin Monitoring
    this.router.get(
      "/admin/quiz-attempts",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin", "intern"]),
      this.quizController.getAllUserQuizAttempts
    );

    this.router.get(
      "/admin/quiz-attempts/:attemptId",
      this.authMiddleware.isAuthenticated,
      this.authMiddleware.checkRole(["superadmin", "admin", "intern"]),
      this.quizController.getUserQuizAttemptDetails
    );
  }

  getRouter() {
    return this.router;
  }
}
