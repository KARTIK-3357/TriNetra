import { api } from './api';

export const projectService = {
  getAllProjects: async (filters = {}) => {
    const query = new URLSearchParams(
      Object.entries({ limit: 48, ...filters }).filter(
        ([, value]) => value && value !== 'All' && value !== 'All Statuses' && value !== 'All Categories' && value !== 'All Areas',
      ),
    );
    return api.get(`/projects${query.size ? `?${query}` : ''}`);
  },
  getProjectById: async (id) => api.get(`/projects/${encodeURIComponent(id)}`),
  getMetadata: async () => api.get('/projects/meta'),
};

export const contractorService = {
  getAll: async (search = '') => api.get(`/contractors${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getByName: async (name) => api.get(`/contractors/${encodeURIComponent(name)}`),
};

export const citizenService = {
  getOverview: async () => api.get('/citizen/overview'),
};
