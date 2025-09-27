import { aiService } from "../services/ai.service.js";
import { Note } from "../models/Note.js";
import { StudyRoom } from "../models/StudyRoom.js";
import ResponseHandler from "../utils/apiResponse.js";

export class AIController {
  async generateStudyRoomSummary(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { roomId } = req.params;
      const { messages } = req.body;

      const summary = await aiService.generateStudyRoomSummary(messages);
      
      // Add AI summary as system message to the room
      const room = await StudyRoom.findById(roomId);
      if (room) {
        room.messages.push({
          user: null,
          content: `🤖 AI Summary: ${summary}`,
          messageType: "ai",
        });
        room.messageCount += 1;
        room.lastAISummary = new Date();
        await room.save();
      }

      response.success({ summary }, "AI summary generated successfully");
    } catch (error) {
      next(error);
    }
  }

  async processNoteContent(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { content, contentType, subject, title } = req.body;
      const userId = req.user._id;
  
      // Generate AI content in parallel
      const [summary, flashcards, quiz] = await Promise.all([
        aiService.generateNoteSummary(content, contentType),
        aiService.generateFlashcards(content, subject),
        aiService.generateQuiz(content, subject)
      ]);
  
      // Create new note
      const note = await Note.create({
        user: userId,
        title,
        content,
        contentType,
        subject,
        aiGenerated: {
          summary,
          flashcards,
          quiz,
          generatedAt: new Date()
        }
      });
  
      response.success({
        note,
        summary,
        flashcards,
        quiz
      }, "Content processed successfully");
    } catch (error) {
      console.error("Error in processNoteContent:", error);
      response.error(null, "Error processing content", 500);
    }
  }

  async getMotivationalMessage(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { stressLevel, progress } = req.body;
      const userId = req.user._id;

      const message = await aiService.generateMotivationalMessage(stressLevel, progress);

      response.success({ message }, "Motivational message generated");
    } catch (error) {
      next(error);
    }
  }

  async analyzeStressLevel(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { responses } = req.body;
      const userId = req.user._id;

      const analysis = await aiService.analyzeStressLevel(responses);

      // Update user profile with stress level
      const { User } = await import("../models/User.js");
      await User.findByIdAndUpdate(userId, {
        stressLevel: analysis.level,
        stressRecommendations: analysis.recommendations,
        lastStressCheck: new Date(),
      });

      response.success(analysis, "Stress level analyzed successfully");
    } catch (error) {
      next(error);
    }
  }

  async getUserNotes(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const userId = req.user._id;
      const { subject, contentType } = req.query;

      let query = { user: userId };
      if (subject) query.subject = subject;
      if (contentType) query.contentType = contentType;

      const notes = await Note.find(query)
        .sort({ createdAt: -1 })
        .limit(50);

      response.success({ notes }, "User notes retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { noteId } = req.params;
      const userId = req.user._id;

      const note = await Note.findOne({ _id: noteId, user: userId });
      if (!note) {
        return response.error(null, "Note not found", 404);
      }

      response.success({ note }, "Note retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
