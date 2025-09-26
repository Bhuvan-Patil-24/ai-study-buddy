import mongoose from "mongoose";

const psychologyTestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    responses: {
      energy: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      motivation: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      sleep: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      appetite: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      sadness: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      enjoyment: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      focus: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      restlessness: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      guilt: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
      lifeWorth: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
      },
    },
    stressLevel: {
      type: String,
      enum: ["low", "moderate", "high", "severe"],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
    },
    recommendations: [{
      type: String,
    }],
    motivationalQuote: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Index to ensure one test per user per day
psychologyTestSchema.index({ user: 1, date: 1 }, { unique: true });

export const PsychologyTest = mongoose.model("PsychologyTest", psychologyTestSchema);
