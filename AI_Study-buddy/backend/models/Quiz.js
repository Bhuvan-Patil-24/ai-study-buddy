import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    globalTimeLimit: {
      type: Number, 
      min: 1,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], 
    isActive: {
      type: Boolean,
      default: true, // Admins can activate/deactivate quizzes
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);