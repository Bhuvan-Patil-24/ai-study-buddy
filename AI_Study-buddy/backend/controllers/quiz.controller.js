import ResponseHandler from "../utils/apiResponse.js";
import { quizService } from "../services/quiz.service.js";

export class QuizController {
  // --- Admin Quiz Management ---
  async createQuiz(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const quiz = await quizService.createQuiz(req.dto, req.user._id);
      response.success(quiz, "Quiz created successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async updateQuiz(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const quiz = await quizService.updateQuiz(
        req.params.quizId,
        req.dto,
        req.user._id
      );
      response.success(quiz, "Quiz updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteQuiz(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await quizService.deleteQuiz(
        req.params.quizId,
        req.user._id
      );
      response.success(result, "Quiz deleted successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getAdminQuizzes(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const quizzes = await quizService.getAdminQuizzes();
      response.success({ quizzes }, "Admin quizzes fetched successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getQuizDetailsForAdmin(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const quizDetails = await quizService.getQuizDetailsForAdmin(
        req.params.quizId
      );
      response.success(
        quizDetails,
        "Quiz details for admin fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async assignUsersToQuiz(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { userIds } = req.dto;
      const quiz = await quizService.assignUsersToQuiz(
        req.params.quizId,
        userIds,
        req.user._id
      );
      response.success(quiz, "Users assigned to quiz successfully.");
    } catch (error) {
      next(error);
    }
  }

  // --- Question Management ---
  async addQuestion(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const question = await quizService.addQuestion(
        req.params.quizId,
        req.dto
      );
      response.success(question, "Question added successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const question = await quizService.updateQuestion(
        req.params.quizId,
        req.params.questionId,
        req.dto
      );
      response.success(question, "Question updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await quizService.deleteQuestion(
        req.params.quizId,
        req.params.questionId
      );
      response.success(result, "Question deleted successfully.");
    } catch (error) {
      next(error);
    }
  }

  // --- User Quiz Attempt ---
  async getUserAssignedQuizzes(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const quizzes = await quizService.getUserAssignedQuizzes(req.user._id);
      response.success(
        { quizzes },
        "Your assigned quizzes fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async startQuiz(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await quizService.startQuiz(
        req.user._id,
        req.params.quizId
      );
      response.success(result, "Quiz started. Here's your first question.");
    } catch (error) {
      next(error);
    }
  }

  async getCurrentQuestion(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await quizService.getCurrentQuestion(
        req.user._id,
        req.params.quizId
      );
      response.success(result, "Current question fetched successfully.");
    } catch (error) {
      if (
        error.message.includes("Quiz time has expired") ||
        error.message.includes("No more questions. Quiz completed")
      ) {
        response.error(null, error.message, 400);
      } else {
        next(error);
      }
    }
  }

  async submitAnswer(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { questionId, selectedOption } = req.body;
      const result = await quizService.submitAnswer(
        req.user._id,
        req.params.quizId,
        questionId,
        selectedOption
      );
      response.success(result, "Answer submitted.");
    } catch (error) {
      if (
        error.message.includes("Quiz time has expired") ||
        error.message.includes("You have already answered this question") ||
        error.message.includes("Incorrect question submitted")
      ) {
        response.error(null, error.message, 400);
      } else {
        next(error);
      }
    }
  }

  async getQuizResult(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await quizService.getQuizResult(
        req.user._id,
        req.params.quizId
      );
      response.success(result, "Quiz result fetched successfully.");
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Monitoring ---
  async getAllUserQuizAttempts(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const attempts = await quizService.getAllUserQuizAttempts();
      response.success(
        { attempts },
        "All user quiz attempts fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserQuizAttemptDetails(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const attemptDetails = await quizService.getUserQuizAttemptDetails(
        req.params.attemptId
      );
      response.success(
        attemptDetails,
        "User quiz attempt details fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}
