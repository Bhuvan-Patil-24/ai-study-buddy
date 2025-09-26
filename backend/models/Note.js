import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["text", "pdf", "youtube", "image"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    originalFile: {
      filename: String,
      originalName: String,
      size: Number,
      mimetype: String,
    },
    aiGenerated: {
      summary: String,
      flashcards: [{
        question: String,
        answer: String,
      }],
      quiz: [{
        question: String,
        options: [String],
        answer: Number,
      }],
      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Index for better query performance
noteSchema.index({ user: 1, subject: 1 });
noteSchema.index({ contentType: 1 });

export const Note = mongoose.model("Note", noteSchema);
