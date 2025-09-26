import api from './api'

export const getUserProfile = () => api.get('/users/profile')
export const updateUserProfile = (data) => api.put('/users/profile', data)
export const getTeamMembers = () => api.get('/users/team')