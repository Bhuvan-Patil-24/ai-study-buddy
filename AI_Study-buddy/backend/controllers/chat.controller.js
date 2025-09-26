// controllers/chat.controller.js

import { chatService } from "../services/chat.service.js";
import ResponseHandler from "../utils/apiResponse.js";

export class ChatController {
  // Admin creates chat room
  async createChatRoom(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const result = await chatService.createChatRoom(req.dto, req.user._id);
      response.success(result, "Chat room created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Admin adds members to chat room
  async addMembers(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { chatRoomId } = req.params;
      const result = await chatService.addMembers(
        chatRoomId,
        req.dto,
        req.user._id
      );
      response.success(result, "Members added successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get user's chat rooms
  async getUserChatRooms(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const chatRooms = await chatService.getUserChatRooms(req.user._id);
      response.success({ chatRooms }, "Chat rooms fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  // Send message in chat room
  async sendMessage(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { chatRoomId } = req.params;
      const result = await chatService.sendMessage(
        chatRoomId,
        req.dto,
        req.user._id
      );
      response.success(result, "Message sent successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Get chat room messages
  async getChatRoomMessages(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { chatRoomId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await chatService.getChatRoomMessages(
        chatRoomId,
        req.user._id,
        parseInt(page),
        parseInt(limit)
      );

      response.success(result, "Messages fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get all chat rooms (admin only)
  async getAllChatRooms(req, res, next) {
    const response = new ResponseHandler(res);
    const allowedRoles = ["superadmin", "admin"];

    if (!allowedRoles.includes(req.user.role)) {
      return response.error(null, "Forbidden", 403);
    }

    try {
      const chatRooms = await chatService.getAllChatRooms();
      response.success({ chatRooms }, "All chat rooms fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  // Remove member from chat room (admin only)
  async removeMember(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { chatRoomId, memberId } = req.params;
      const result = await chatService.removeMember(
        chatRoomId,
        memberId,
        req.user._id
      );
      response.success(result, "Member removed successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get chat room details
  async getChatRoomDetails(req, res, next) {
    const response = new ResponseHandler(res);
    try {
      const { chatRoomId } = req.params;
      const chatRoom = await chatService.getChatRoomDetails(
        chatRoomId,
        req.user._id
      );
      response.success({ chatRoom }, "Chat room details fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
