import { api } from './api';

export const feedbackService = {
  submitFeedback: async (payload) => api.post('/feedback', payload),
};
