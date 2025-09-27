import mongoose from "mongoose";

const studyRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    maxMembers: {
      type: Number,
      default: 10,
      min: 2,
      max: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    messages: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
      messageType: {
        type: String,
        enum: ["user", "ai", "system"],
        default: "user",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    messageCount: {
      type: Number,
      default: 0,
    },
    lastAISummary: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
const defaultRoom = {
  name: "GATE CSE Discussion Room",
  description: "Default room for discussing GATE CSE topics with AI assistance",
  subject: "GATE CS",
  difficulty: "intermediate",
  maxMembers: 50,
  isActive: true
};

// Add this to the StudyRoom model
studyRoomSchema.statics.createDefaultRoom = async function(creatorId) {
  const existingRoom = await this.findOne({ name: defaultRoom.name });
  if (!existingRoom) {
    return await this.create({
      ...defaultRoom,
      creator: creatorId,
      members: [{ user: creatorId }]
    });
  }
  return existingRoom;
};
// Index for better query performance
studyRoomSchema.index({ subject: 1, isActive: 1 });
studyRoomSchema.index({ creator: 1 });

export const StudyRoom = mongoose.model("StudyRoom", studyRoomSchema);
