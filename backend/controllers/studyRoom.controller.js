import { StudyRoom } from "../models/StudyRoom.js";
import { aiService } from "../services/ai.service.js";
import ResponseHandler from "../utils/apiResponse.js";
import { Server } from "socket.io";

export class StudyRoomController {
  constructor() {
    this.io = null;
  }

  setSocketIO(io) {
    this.io = io;
  }

  async getRooms(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      // Create default room if it doesn't exist
      await StudyRoom.createDefaultRoom(req.user._id);
      
      const { subject, difficulty, isActive } = req.query;
      let query = {};
      if (subject) query.subject = subject;
      if (difficulty) query.difficulty = difficulty;
      if (isActive !== undefined) query.isActive = isActive === "true";

      const rooms = await StudyRoom.find(query)
        .populate("creator", "name email")
        .populate("members.user", "name email")
        .sort({ createdAt: -1 });

      response.success({ rooms }, "Study rooms retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      const room = await StudyRoom.findById(roomId);
      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      // Add message
      const newMessage = {
        user: userId,
        content,
        messageType: "user",
      };
      
      room.messages.push(newMessage);
      room.messageCount += 1;

      // Generate AI summary every 10 messages
      if (room.messageCount % 10 === 0) {
        const recentMessages = room.messages.slice(-10);
        const summary = await aiService.generateStudyRoomSummary(recentMessages);
        
        room.messages.push({
          user: null,
          content: `🤖 AI Summary: ${summary}`,
          messageType: "ai",
        });
        room.lastAISummary = new Date();
      }

      await room.save();
      await room.populate("messages.user", "name email");

      // Emit new message to all room members
      if (this.io) {
        this.io.to(roomId).emit("newMessage", {
          message: room.messages[room.messages.length - 1]
        });
      }

      response.success({ message: room.messages[room.messages.length - 1] }, "Message sent successfully");
    } catch (error) {
      next(error);
    }
  }
  async createRoom(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { name, description, subject, difficulty, maxMembers } = req.body;
      const creatorId = req.user._id;

      const room = await StudyRoom.create({
        name,
        description,
        subject,
        difficulty,
        creator: creatorId,
        maxMembers: maxMembers || 10,
        members: [{ user: creatorId }],
      });

      response.success({ room }, "Study room created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getRooms(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { subject, difficulty, isActive } = req.query;
      
      let query = {};
      if (subject) query.subject = subject;
      if (difficulty) query.difficulty = difficulty;
      if (isActive !== undefined) query.isActive = isActive === "true";

      const rooms = await StudyRoom.find(query)
        .populate("creator", "name email")
        .populate("members.user", "name email")
        .sort({ createdAt: -1 });

      response.success({ rooms }, "Study rooms retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getRoomById(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;

      const room = await StudyRoom.findById(roomId)
        .populate("creator", "name email")
        .populate("members.user", "name email")
        .populate("messages.user", "name email");

      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      response.success({ room }, "Study room retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async joinRoom(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const userId = req.user._id;

      const room = await StudyRoom.findById(roomId);
      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      if (!room.isActive) {
        return response.error(null, "Study room is not active", 400);
      }

      if (room.members.length >= room.maxMembers) {
        return response.error(null, "Study room is full", 400);
      }

      // Check if user is already a member
      const isMember = room.members.some(member => member.user.toString() === userId);
      if (isMember) {
        return response.error(null, "You are already a member of this room", 400);
      }

      room.members.push({ user: userId });
      await room.save();

      response.success({ room }, "Joined study room successfully");
    } catch (error) {
      next(error);
    }
  }

  async leaveRoom(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const userId = req.user._id;

      const room = await StudyRoom.findById(roomId);
      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      room.members = room.members.filter(member => member.user.toString() !== userId);
      await room.save();

      response.success({ room }, "Left study room successfully");
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      const room = await StudyRoom.findById(roomId);
      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      // Check if user is a member
      const isMember = room.members.some(member => member.user.toString() === userId);
      if (!isMember) {
        return response.error(null, "You are not a member of this room", 403);
      }

      // Add message
      room.messages.push({
        user: userId,
        content,
        messageType: "user",
      });
      room.messageCount += 1;

      // Check if we need to generate AI summary (every 10 messages)
      if (room.messageCount % 10 === 0) {
        const recentMessages = room.messages.slice(-10);
        const summary = await aiService.generateStudyRoomSummary(recentMessages);
        
        room.messages.push({
          user: null,
          content: `🤖 AI Summary: ${summary}`,
          messageType: "ai",
        });
        room.lastAISummary = new Date();
      }

      await room.save();

      // Populate the new message
      const newMessage = room.messages[room.messages.length - 1];
      await room.populate("messages.user", "name email");

      response.success({ message: newMessage }, "Message sent successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const room = await StudyRoom.findById(roomId)
        .populate("messages.user", "name email")
        .select("messages");

      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const messages = room.messages.slice(startIndex, endIndex).reverse();

      response.success({ messages }, "Messages retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteRoom(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const userId = req.user._id;

      const room = await StudyRoom.findById(roomId);
      if (!room) {
        return response.error(null, "Study room not found", 404);
      }

      // Check if user is the creator
      if (room.creator.toString() !== userId) {
        return response.error(null, "Only the creator can delete this room", 403);
      }

      await StudyRoom.findByIdAndDelete(roomId);

      response.success(null, "Study room deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const studyRoomController = new StudyRoomController();
