import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 2;
        },
        message: "A question must have at least two options.",
      },
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timeLimit: {
      type: Number,
      min: 5,
      default: null,
    },
    questionType: {
      type: String,
      enum: ["single_choice", "multiple_choice", "true_false", "text_input"],
      default: "single_choice",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

questionSchema.index({ quizId: 1, order: 1 }, { unique: true });

export const Question = mongoose.model("Question", questionSchema);
