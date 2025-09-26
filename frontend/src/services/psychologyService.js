import api from "./api";

export const psychologyService = {
  // Submit psychology test
  submitTest: (responses) => api.post("/v8/psychology/submit", responses),

  // Get today's test status
  getTodayStatus: () => api.get("/v8/psychology/today-status"),

  // Get test history
  getTestHistory: (limit = 30) => api.get(`/v8/psychology/history?limit=${limit}`),

  // Get stress trends
  getStressTrends: (days = 7) => api.get(`/v8/psychology/trends?days=${days}`),

  // Admin - Get all users' psychology data
  getAllUsersData: () => api.get("/v8/psychology/admin/all-data"),
};
