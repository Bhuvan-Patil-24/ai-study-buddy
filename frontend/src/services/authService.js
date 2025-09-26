import api from "./api";

export const login = (credentials) => api.post("/v1/auth/login", credentials);
export const register = (userData) => api.post("/v1/auth/register", userData); // userData should NOT include role
export const logout = () => api.post("/v1/auth/logout");
