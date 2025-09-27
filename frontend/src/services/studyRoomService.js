import api from "./api";

export const studyRoomService = {
  // Create Study Room
  async createRoom(roomData) {
    try {
      const response = await api.post("/study-rooms", roomData);
      return response.data;
    } catch (error) {
      console.error("Error creating study room:", error);
      throw error;
    }
  },

  // Get All Rooms
  async getRooms(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/study-rooms?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching study rooms:", error);
      throw error;
    }
  },

  // Get Room by ID
  async getRoomById(roomId) {
    try {
      const response = await api.get(`/study-rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching study room:", error);
      throw error;
    }
  },

  // Join Room
  async joinRoom(roomId) {
    try {
      const response = await api.post(`/study-rooms/${roomId}/join`);
      return response.data;
    } catch (error) {
      console.error("Error joining study room:", error);
      throw error;
    }
  },

  // Get Messages
  async getMessages(roomId) {
    try {
      const response = await api.get(`/study-rooms/${roomId}/messages`);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send Message
  async sendMessage(roomId, content) {
    try {
      const response = await api.post(`/study-rooms/${roomId}/messages`, { content });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Leave Room
  async leaveRoom(roomId) {
    try {
      const response = await api.post(`/study-rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      console.error("Error leaving study room:", error);
      throw error;
    }
  },

  // Send Message
  async sendMessage(roomId, content) {
    try {
      const response = await api.post(`/study-rooms/${roomId}/messages`, { content });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Get Messages
  async getMessages(roomId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/study-rooms/${roomId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Delete Room
  async deleteRoom(roomId) {
    try {
      const response = await api.delete(`/study-rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting study room:", error);
      throw error;
    }
  },
  // Add file handling to sendMessage
  async sendMessage(roomId, content, file = null) {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }
      
      const response = await api.post(`/study-rooms/${roomId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
};

export default studyRoomService;
