// routes/chat.routes.js

import express from "express";
import { ChatController } from "../controllers/chat.controller.js";
import {
  CreateChatRoomDto,
  AddMembersDto,
  SendMessageDto,
} from "../dtos/chat.dto.js";
import { validateDto } from "../middlewares/validateDto.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

export class ChatRoutes {
  constructor() {
    this.router = express.Router();
    this.chatController = new ChatController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Apply authentication to all chat routes
    this.router.use(this.authMiddleware.isAuthenticated);

    // Admin only routes - Create chat room
    this.router.post(
      "/rooms",
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(CreateChatRoomDto),
      this.chatController.createChatRoom
    );

    // Admin only routes - Add members to chat room
    this.router.post(
      "/rooms/:chatRoomId/members",
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      validateDto(AddMembersDto),
      this.chatController.addMembers
    );

    // Admin only routes - Remove member from chat room
    this.router.delete(
      "/rooms/:chatRoomId/members/:memberId",
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      this.chatController.removeMember
    );

    // Admin only routes - Get all chat rooms
    this.router.get(
      "/rooms/all",
      this.authMiddleware.checkRole(["superadmin", "admin"]),
      this.chatController.getAllChatRooms
    );

    // User routes - Get user's chat rooms
    this.router.get("/rooms", this.chatController.getUserChatRooms);

    // User routes - Send message in chat room
    this.router.post(
      "/rooms/:chatRoomId/messages",
      validateDto(SendMessageDto),
      this.chatController.sendMessage
    );

    // User routes - Get messages from chat room
    this.router.get(
      "/rooms/:chatRoomId/messages",
      this.chatController.getChatRoomMessages
    );

    // User routes - Get specific chat room details
    this.router.get(
      "/rooms/:chatRoomId",
      this.chatController.getChatRoomDetails
    );
  }

  getRouter() {
    return this.router;
  }
}
