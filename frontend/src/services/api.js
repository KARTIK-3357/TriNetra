const configuredUrl = (import.meta.env.VITE_API_URL || '').trim();
const API_BASE_URL = !configuredUrl || configuredUrl.includes(':5000/') ? '/api' : configuredUrl.replace(/\/$/, '');

async function request(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error('Cannot reach the API. Start the backend on port 8000.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.detail || 'Request failed');
  }
  return payload;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) =>
    request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    }),
};
