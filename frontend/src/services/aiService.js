import api from "./api";

export const aiService = {
  // Study Room AI
  async generateStudyRoomSummary(roomId, messages) {
    try {
      const response = await api.post(`/ai/study-rooms/${roomId}/summary`, { messages });
      return response.data;
    } catch (error) {
      console.error("Error generating study room summary:", error);
      throw error;
    }
  },

  // Note Processing
  async processNoteContent(content, contentType, subject, title) {
    try {
      const response = await api.post("/ai/notes/process", {
        content,
        contentType,
        subject,
        title,
      });
      return response.data;
    } catch (error) {
      console.error("Error processing note content:", error);
      throw error;
    }
  },

  // Get User Notes
  async getUserNotes(subject = null, contentType = null) {
    try {
      const params = new URLSearchParams();
      if (subject) params.append("subject", subject);
      if (contentType) params.append("contentType", contentType);
      
      const response = await api.get(`/ai/notes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user notes:", error);
      throw error;
    }
  },

  // Get Note by ID
  async getNoteById(noteId) {
    try {
      const response = await api.get(`/ai/notes/${noteId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching note:", error);
      throw error;
    }
  },

  // Motivational Messages
  async getMotivationalMessage(stressLevel, progress) {
    try {
      const response = await api.post("/ai/motivational-message", {
        stressLevel,
        progress,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting motivational message:", error);
      throw error;
    }
  },

  // Stress Level Analysis
  async analyzeStressLevel(responses) {
    try {
      const response = await api.post("/ai/stress-analysis", { responses });
      return response.data;
    } catch (error) {
      console.error("Error analyzing stress level:", error);
      throw error;
    }
  },
};

export default aiService;
