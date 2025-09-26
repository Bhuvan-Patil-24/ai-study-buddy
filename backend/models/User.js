import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      required: true,
    },
    stressLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },
    stressRecommendations: [String],
    lastStressCheck: Date,
    examPreference: String,
    streak: {
      type: Number,
      default: 0,
    },
    leaderboardPoints: {
      type: Number,
      default: 0,
    },
    testsTaken: {
      type: Number,
      default: 0,
    },
    notesUploaded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
