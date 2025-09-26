import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";
import { UserQuizAttempt } from "../models/UserQuizAttempt.js";
import { User } from "../models/User.js";

export class QuizService {
  async createQuiz(dto, createdBy) {
    if (dto.assignedTo && dto.assignedTo.length > 0) {
      const existingUsers = await User.find({ _id: { $in: dto.assignedTo } });
      if (existingUsers.length !== dto.assignedTo.length) {
        throw new Error("One or more assigned users do not exist.");
      }
    }
    const quiz = await Quiz.create({ ...dto, createdBy });
    return quiz;
  }

  async updateQuiz(quizId, dto, userId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found.");
    if (quiz.createdBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to update this quiz.");
    }

    if (dto.assignedTo && dto.assignedTo.length > 0) {
      const existingUsers = await User.find({ _id: { $in: dto.assignedTo } });
      if (existingUsers.length !== dto.assignedTo.length) {
        throw new Error("One or more assigned users do not exist.");
      }
    }

    Object.assign(quiz, dto);
    await quiz.save();
    return quiz;
  }

  async deleteQuiz(quizId, userId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found.");
    if (quiz.createdBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to delete this quiz.");
    }

    await Question.deleteMany({ quizId: quiz._id });
    await UserQuizAttempt.deleteMany({ quizId: quiz._id });

    await quiz.deleteOne();
    return { message: "Quiz and associated data deleted successfully." };
  }

  async getAdminQuizzes() {
    return await Quiz.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
  }

  async getQuizDetailsForAdmin(quizId) {
    const quiz = await Quiz.findById(quizId)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
    if (!quiz) throw new Error("Quiz not found.");
    const questions = await Question.find({ quizId: quiz._id }).sort({
      order: 1,
    });
    return { quiz, questions };
  }

  async assignUsersToQuiz(quizId, userIds, adminId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found.");
    if (quiz.createdBy.toString() !== adminId.toString()) {
      throw new Error("Unauthorized to modify this quiz.");
    }

    const existingUsers = await User.find({ _id: { $in: userIds } });
    if (existingUsers.length !== userIds.length) {
      throw new Error("One or more provided user IDs do not exist.");
    }

    quiz.assignedTo = userIds;
    await quiz.save();
    return quiz;
  }

  async addQuestion(quizId, dto) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found.");

    const question = await Question.create({ ...dto, quizId });
    return question;
  }

  async updateQuestion(quizId, questionId, dto) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found.");

    const question = await Question.findOneAndUpdate(
      { _id: questionId, quizId: quizId },
      dto,
      { new: true }
    );
    if (!question)
      throw new Error("Question not found or does not belong to this quiz.");
    return question;
  }

  async deleteQuestion(quizId, questionId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found.");

    const result = await Question.deleteOne({
      _id: questionId,
      quizId: quizId,
    });
    if (result.deletedCount === 0)
      throw new Error("Question not found or does not belong to this quiz.");

    await UserQuizAttempt.updateMany(
      { quizId: quizId, "answers.questionId": questionId },
      { $pull: { answers: { questionId: questionId } } }
    );

    return { message: "Question deleted successfully." };
  }

  // --- User Quiz Attempt Logic ---

  async getUserAssignedQuizzes(userId) {
    const quizzes = await Quiz.find({
      isActive: true,
      $or: [
        { assignedTo: userId },
        { assignedTo: { $exists: true, $size: 0 } },
      ],
    })
      .select("-createdBy -assignedTo")
      .lean();

    const attempts = await UserQuizAttempt.find({ userId })
      .select("quizId status score startTime endTime")
      .lean();

    const quizzesWithStatus = quizzes.map((quiz) => {
      const attempt = attempts.find((att) => att.quizId.equals(quiz._id));
      return {
        ...quiz,
        userAttemptStatus: attempt ? attempt.status : "not_started",
        userScore: attempt ? attempt.score : null,
        userStartTime: attempt ? attempt.startTime : null,
        userEndTime: attempt ? attempt.endTime : null,
      };
    });

    return quizzesWithStatus;
  }

  async startQuiz(userId, quizId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isActive)
      throw new Error("Quiz not found or is inactive.");

    const isAssigned =
      quiz.assignedTo.length === 0 || quiz.assignedTo.includes(userId);
    if (!isAssigned) throw new Error("You are not assigned to this quiz.");

    let attempt = await UserQuizAttempt.findOne({ userId, quizId });
    if (attempt) {
      if (attempt.status === "completed" || attempt.status === "expired") {
        throw new Error(
          "You have already completed or attempted this quiz. Multiple attempts not allowed."
        );
      }
      attempt.status = "started";
      attempt.startTime = attempt.startTime || new Date();
      await attempt.save();
    } else {
      const totalQuestions = await Question.countDocuments({ quizId });
      if (totalQuestions === 0) {
        throw new Error("Cannot start quiz: No questions available.");
      }
      attempt = await UserQuizAttempt.create({
        userId,
        quizId,
        startTime: new Date(),
        status: "started",
        totalQuestions,
        currentQuestionIndex: 0,
      });
    }

    const firstQuestion = await Question.findOne({ quizId }).sort({ order: 1 });
    if (!firstQuestion) throw new Error("No questions found for this quiz.");

    return {
      attemptId: attempt._id,
      quizTitle: quiz.title,
      globalTimeLimit: quiz.globalTimeLimit,
      currentQuestion: {
        _id: firstQuestion._id,
        questionText: firstQuestion.questionText,
        options: firstQuestion.options,
        timeLimit: firstQuestion.timeLimit,
        questionType: firstQuestion.questionType,
        order: firstQuestion.order,
      },
      currentQuestionNumber: 1,
      totalQuestions: attempt.totalQuestions,
      startTime: attempt.startTime,
    };
  }

  async getCurrentQuestion(userId, quizId) {
    const attempt = await UserQuizAttempt.findOne({ userId, quizId }).populate(
      "quizId"
    );
    if (!attempt)
      throw new Error("Quiz attempt not found. Please start the quiz first.");
    if (attempt.status !== "started")
      throw new Error(`Quiz is already ${attempt.status}.`);

    const quiz = attempt.quizId;
    if (!quiz || !quiz.isActive)
      throw new Error("Associated quiz not found or is inactive.");

    if (quiz.globalTimeLimit) {
      const quizEndTime = new Date(
        attempt.startTime.getTime() + quiz.globalTimeLimit * 60 * 1000
      );
      if (new Date() > quizEndTime) {
        attempt.status = "expired";
        attempt.endTime = new Date();
        attempt.quizExpired = true;
        await attempt.save();
        throw new Error("Quiz time has expired.");
      }
    }

    const currentQuestionOrder = attempt.currentQuestionIndex + 1;
    const question = await Question.findOne({
      quizId,
      order: currentQuestionOrder,
    });

    if (!question) {
      if (attempt.status === "started") {
        attempt.status = "completed";
        attempt.endTime = new Date();
        await this._calculateScore(attempt);
        await attempt.save();
      }
      throw new Error("No more questions. Quiz completed.");
    }

    return {
      attemptId: attempt._id,
      quizTitle: quiz.title,
      globalTimeLimit: quiz.globalTimeLimit,
      currentQuestion: {
        _id: question._id,
        questionText: question.questionText,
        options: question.options,
        timeLimit: question.timeLimit,
        questionType: question.questionType,
        order: question.order,
      },
      currentQuestionNumber: attempt.currentQuestionIndex + 1,
      totalQuestions: attempt.totalQuestions,
      startTime: attempt.startTime,
      timeRemainingForQuiz: quiz.globalTimeLimit
        ? Math.max(
            0,
            quiz.globalTimeLimit * 60 * 1000 -
              (new Date().getTime() - attempt.startTime.getTime())
          ) / 1000
        : null,
    };
  }

  async submitAnswer(userId, quizId, questionId, selectedOption) {
    const attempt = await UserQuizAttempt.findOne({ userId, quizId }).populate(
      "quizId"
    );
    if (!attempt) throw new Error("Quiz attempt not found.");
    if (attempt.status !== "started")
      throw new Error("Quiz is not in a started state.");

    const quiz = attempt.quizId;

    if (quiz.globalTimeLimit) {
      const quizEndTime = new Date(
        attempt.startTime.getTime() + quiz.globalTimeLimit * 60 * 1000
      );
      if (new Date() > quizEndTime) {
        attempt.status = "expired";
        attempt.endTime = new Date();
        attempt.quizExpired = true;
        await attempt.save();
        throw new Error("Quiz time has expired. Answer not recorded.");
      }
    }

    const question = await Question.findById(questionId);
    if (!question || !question.quizId.equals(quizId)) {
      throw new Error("Question not found or does not belong to this quiz.");
    }

    const expectedCurrentQuestionOrder = attempt.currentQuestionIndex + 1;
    if (question.order !== expectedCurrentQuestionOrder) {
      throw new Error(
        "Incorrect question submitted. Please submit the current question."
      );
    }

    const existingAnswerIndex = attempt.answers.findIndex((ans) =>
      ans.questionId.equals(questionId)
    );
    if (
      existingAnswerIndex !== -1 &&
      attempt.answers[existingAnswerIndex].submittedAt
    ) {
      throw new Error("You have already answered this question.");
    }

    let isCorrect = false;
    if (
      question.questionType === "single_choice" ||
      question.questionType === "true_false" ||
      question.questionType === undefined
    ) {
      isCorrect = selectedOption === question.correctAnswer;
    } else if (question.questionType === "multiple_choice") {
      if (!Array.isArray(selectedOption)) {
        throw new Error(
          "Selected option for multiple choice must be an array."
        );
      }
      const sortedSelected = [...selectedOption].sort();
      const sortedCorrect = [...question.correctAnswer].sort();
      isCorrect =
        JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    } else if (question.questionType === "text_input") {
      isCorrect =
        String(selectedOption).toLowerCase() ===
        String(question.correctAnswer).toLowerCase();
    }

    if (existingAnswerIndex !== -1) {
      attempt.answers[existingAnswerIndex].selectedOption = selectedOption;
      attempt.answers[existingAnswerIndex].submittedAt = new Date();
      attempt.answers[existingAnswerIndex].isCorrect = isCorrect;
    } else {
      attempt.answers.push({
        questionId,
        selectedOption,
        submittedAt: new Date(),
        isCorrect,
      });
    }

    attempt.currentQuestionIndex++;

    if (attempt.currentQuestionIndex >= attempt.totalQuestions) {
      attempt.status = "completed";
      attempt.endTime = new Date();
      await this._calculateScore(attempt);
    }

    await attempt.save();

    return {
      message: "Answer submitted successfully.",
      isCorrect: isCorrect,
      quizStatus: attempt.status,
      nextQuestionAvailable:
        attempt.currentQuestionIndex < attempt.totalQuestions,
    };
  }

  async _calculateScore(attempt) {
    const totalCorrect = attempt.answers.filter((ans) => ans.isCorrect).length;
    attempt.score = (totalCorrect / attempt.totalQuestions) * 100;
  }

  async getQuizResult(userId, quizId) {
    const attempt = await UserQuizAttempt.findOne({ userId, quizId })
      .populate("quizId", "title description")
      .populate(
        "answers.questionId",
        "questionText options correctAnswer questionType order"
      );
    if (!attempt) throw new Error("Quiz attempt not found.");
    if (attempt.status === "started")
      throw new Error("Quiz is still in progress.");

    const formattedAnswers = attempt.answers.map((ans) => {
      const question = ans.questionId;
      return {
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        questionType: question.questionType,
        correctAnswer: question.correctAnswer,
        selectedOption: ans.selectedOption,
        isCorrect: ans.isCorrect,
      };
    });

    return {
      quizTitle: attempt.quizId.title,
      quizDescription: attempt.quizId.description,
      score: attempt.score,
      status: attempt.status,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      totalQuestions: attempt.totalQuestions,
      answeredQuestions: attempt.answers.length,
      answers: formattedAnswers,
    };
  }

  async getAllUserQuizAttempts() {
    return await UserQuizAttempt.find()
      .populate("userId", "name email role")
      .populate("quizId", "title description")
      .sort({ startTime: -1 });
  }

  async getUserQuizAttemptDetails(attemptId) {
    const attempt = await UserQuizAttempt.findById(attemptId)
      .populate("userId", "name email role")
      .populate("quizId", "title description globalTimeLimit")
      .populate(
        "answers.questionId",
        "questionText options correctAnswer questionType"
      );
    if (!attempt) throw new Error("Quiz attempt not found.");
    return attempt;
  }
}

export const quizService = new QuizService();
