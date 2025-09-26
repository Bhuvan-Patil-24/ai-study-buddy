import mongoose from "mongoose";

const userSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
    },
    ipAddress: {
      type: String,
      required: false, // Make it optional in case it's not always captured
    },
    userAgent: {
      type: String,
      required: false, // Make it optional
    },
  },
  { timestamps: true }
);

export const UserSession = mongoose.model("UserSession", userSessionSchema);
