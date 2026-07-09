const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClientError extends Error {
  constructor(message, field, status) {
    super(message);
    this.field = field;
    this.status = status;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) {
    return null;
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = body?.error?.message || `Error ${res.status}`;
    throw new ApiClientError(message, body?.error?.field ?? null, res.status);
  }

  return body;
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const tasksApi = {
  list(filters) {
    return request(`/tasks${buildQuery(filters)}`);
  },
  stats() {
    return request('/tasks/stats');
  },
  getById(id) {
    return request(`/tasks/${id}`);
  },
  create(payload) {
    return request('/tasks', { method: 'POST', body: JSON.stringify(payload) });
  },
  update(id, patch) {
    return request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
  },
  remove(id) {
    return request(`/tasks/${id}`, { method: 'DELETE' });
  },
};

export { ApiClientError };
