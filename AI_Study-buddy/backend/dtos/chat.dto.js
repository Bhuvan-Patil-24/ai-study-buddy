// dtos/chat.dto.js

export class CreateChatRoomDto {
  constructor({ name, description, memberIds }) {
    this.name = name;
    this.description = description || "";
    this.memberIds = memberIds || [];
  }

  validate() {
    if (!this.name || this.name.trim() === "") {
      throw new Error("Chat room name is required.");
    }

    if (this.name.length > 100) {
      throw new Error("Chat room name must be less than 100 characters.");
    }

    if (!Array.isArray(this.memberIds)) {
      throw new Error("Member IDs must be an array.");
    }
  }
}

export class AddMembersDto {
  constructor({ memberIds }) {
    this.memberIds = memberIds || [];
  }

  validate() {
    if (!Array.isArray(this.memberIds) || this.memberIds.length === 0) {
      throw new Error("At least one member ID is required.");
    }
  }
}

export class SendMessageDto {
  constructor({ content, messageType, taggedUserIds }) {
    this.content = content;
    this.messageType = messageType || "text";
    this.taggedUserIds = taggedUserIds || [];
  }

  validate() {
    if (!this.content || this.content.trim() === "") {
      throw new Error("Message content is required.");
    }

    if (this.content.length > 1000) {
      throw new Error("Message content must be less than 1000 characters.");
    }

    if (!["text", "link"].includes(this.messageType)) {
      throw new Error("Message type must be 'text' or 'link'.");
    }

    if (this.messageType === "link") {
      const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(this.content)) {
        throw new Error("Invalid URL format for link message.");
      }
    }

    if (!Array.isArray(this.taggedUserIds)) {
      throw new Error("Tagged user IDs must be an array.");
    }
  }
}
