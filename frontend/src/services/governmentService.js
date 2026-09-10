import { api } from './api';

export async function getGovernmentOverview(query = '') {
  return api.get(`/government/overview${query}`);
}

export async function getGovernmentProjects(filters = {}) {
  const params = new URLSearchParams({ limit: '48' });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.district && filters.district !== 'All') params.set('district', filters.district);
  if (filters.status && filters.status !== 'All') params.set('status', filters.status);
  if (filters.type && filters.type !== 'All') params.set('category', filters.type);
  if (filters.risk && filters.risk !== 'All') params.set('risk', filters.risk);
  const result = await api.get(`/projects?${params}`);
  return { items: result.items || [], total: result.total || 0 };
}

export async function getProjectById(id) {
  return api.get(`/projects/${encodeURIComponent(id)}`);
}

export async function getRiskProjects() {
  return api.get('/government/risk-monitor');
}

export async function runRiskScan() {
  return api.post('/government/risk-scan', {});
}

export async function getInvestigations() {
  return api.get('/government/investigations');
}

export async function getInvestigationById(id) {
  return api.get(`/government/investigations/${encodeURIComponent(id)}`);
}

export async function getAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.region && filters.region !== 'All') params.set('district', filters.region);
  if (filters.department && filters.department !== 'All') params.set('category', filters.department);
  if (filters.status && filters.status !== 'All') params.set('status', filters.status);
  const suffix = params.size ? `?${params}` : '';
  return api.get(`/government/analytics${suffix}`);
}
