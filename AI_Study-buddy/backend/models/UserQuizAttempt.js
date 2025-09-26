import mongoose from "mongoose";

const userQuizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["started", "completed", "expired", "abandoned"],
      default: "started",
    },
    score: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOption: {
          type: mongoose.Schema.Types.Mixed,
          default: null,
        },
        submittedAt: {
          type: Date,
          default: null,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    quizExpired: {
      type: Boolean,
      default: false,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

userQuizAttemptSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export const UserQuizAttempt = mongoose.model(
  "UserQuizAttempt",
  userQuizAttemptSchema
);
