import { ChatRoom } from "../models/ChatRoom.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

export class ChatService {
  // Admin creates a chat room
  async createChatRoom(dto, adminId) {
    // Verify members exist
    if (dto.memberIds.length > 0) {
      const existingMembers = await User.find({ _id: { $in: dto.memberIds } });
      if (existingMembers.length !== dto.memberIds.length) {
        throw new Error("Some member IDs are invalid.");
      }
    }

    const chatRoom = await ChatRoom.create({
      name: dto.name,
      description: dto.description,
      createdBy: adminId,
      members: dto.memberIds,
    });

    return await ChatRoom.findById(chatRoom._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
  }

  // Admin adds members to chat room
  async addMembers(chatRoomId, dto, adminId) {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new Error("Chat room not found.");
    }

    if (chatRoom.createdBy.toString() !== adminId.toString()) {
      throw new Error("Only the chat room creator can add members.");
    }

    // Verify new members exist
    const existingMembers = await User.find({ _id: { $in: dto.memberIds } });
    if (existingMembers.length !== dto.memberIds.length) {
      throw new Error("Some member IDs are invalid.");
    }

    // Add only new members (avoid duplicates)
    const newMembers = dto.memberIds.filter(
      (memberId) =>
        !chatRoom.members.some(
          (existing) => existing.toString() === memberId.toString()
        )
    );

    chatRoom.members.push(...newMembers);
    await chatRoom.save();

    return await ChatRoom.findById(chatRoomId)
      .populate("createdBy", "name email")
      .populate("members", "name email");
  }

  // Get user's chat rooms
  async getUserChatRooms(userId) {
    return await ChatRoom.find({
      $or: [{ createdBy: userId }, { members: userId }],
      isActive: true,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ updatedAt: -1 });
  }

  // Send message in chat room
  async sendMessage(chatRoomId, dto, senderId) {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new Error("Chat room not found.");
    }

    // Check if user is member of the chat room
    const isMember =
      chatRoom.members.some(
        (member) => member.toString() === senderId.toString()
      ) || chatRoom.createdBy.toString() === senderId.toString();

    if (!isMember) {
      throw new Error("You are not a member of this chat room.");
    }

    // Verify tagged users are members of the chat room
    if (dto.taggedUserIds.length > 0) {
      const validTaggedUsers = dto.taggedUserIds.filter(
        (userId) =>
          chatRoom.members.some(
            (member) => member.toString() === userId.toString()
          ) || chatRoom.createdBy.toString() === userId.toString()
      );
      dto.taggedUserIds = validTaggedUsers;
    }

    const message = await Message.create({
      chatRoom: chatRoomId,
      sender: senderId,
      content: dto.content,
      messageType: dto.messageType,
      taggedUsers: dto.taggedUserIds,
    });

    return await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("taggedUsers", "name email");
  }

  // Get messages from chat room
  async getChatRoomMessages(chatRoomId, userId, page = 1, limit = 50) {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new Error("Chat room not found.");
    }

    // Check if user is member
    const isMember =
      chatRoom.members.some(
        (member) => member.toString() === userId.toString()
      ) || chatRoom.createdBy.toString() === userId.toString();

    if (!isMember) {
      throw new Error("You are not a member of this chat room.");
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate("sender", "name email")
      .populate("taggedUsers", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chatRoom: chatRoomId });

    return {
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get all chat rooms (admin only)
  async getAllChatRooms() {
    return await ChatRoom.find({ isActive: true })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });
  }

  // Remove member from chat room (admin only)
  async removeMember(chatRoomId, memberIdToRemove, adminId) {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new Error("Chat room not found.");
    }

    if (chatRoom.createdBy.toString() !== adminId.toString()) {
      throw new Error("Only the chat room creator can remove members.");
    }

    chatRoom.members = chatRoom.members.filter(
      (member) => member.toString() !== memberIdToRemove.toString()
    );

    await chatRoom.save();

    return await ChatRoom.findById(chatRoomId)
      .populate("createdBy", "name email")
      .populate("members", "name email");
  }

  async getChatRoomDetails(chatRoomId, userId) {
    const chatRoom = await ChatRoom.findById(chatRoomId)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!chatRoom) {
      throw new Error("Chat room not found.");
    }

    const isMember =
      chatRoom.members.some((member) => member.id === userId.toString()) ||
      chatRoom.createdBy.id === userId.toString();

    if (!isMember) {
      throw new Error("You are not a member of this chat room.");
    }

    return chatRoom;
  }
}

export const chatService = new ChatService();
