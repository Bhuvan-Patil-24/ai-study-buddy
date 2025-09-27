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
async analyzeStressLevel(req, res) {
  const response = new ResponseHandler(res);
  try {
    const { responses } = req.body;
    if (!responses) {
      return response.error(null, "No responses provided", 400);
    }

    const result = await psychologyService.calculateStressLevel(responses);
    return response.success(result, "Stress level analyzed successfully");
  } catch (error) {
    console.error("Error in stress analysis:", error);
    return response.error(null, "Error analyzing stress level", 500);
  }
}
}
export default aiService;
