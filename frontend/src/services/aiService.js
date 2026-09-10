import { api } from './api';

export const aiService = {
  getRiskInsights: async () => api.get('/ai/risk-insights'),
  analyzeIssue: async (issueData) => api.post('/ai/analyze-issue', issueData),
};
