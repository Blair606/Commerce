export const API_BASE_URL = 'http://localhost:5000/api';
export const BACKEND_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
    PROFILE: `${API_BASE_URL}/users/profile`
  },
  USERS: {
    ALL: `${API_BASE_URL}/users/all`,
    APPROVE: (id: number) => `${API_BASE_URL}/users/${id}/approve`,
    REJECT: (id: number) => `${API_BASE_URL}/users/${id}/reject`,
    ROLE: (id: number) => `${API_BASE_URL}/users/${id}/role`,
    DEACTIVATE: (id: number) => `${API_BASE_URL}/users/${id}/deactivate`,
    REACTIVATE: (id: number) => `${API_BASE_URL}/users/${id}/reactivate`,
    PENDING: `${API_BASE_URL}/users/pending`,
    UPDATE_ROLE: `${API_BASE_URL}/users/all`,
    DASHBOARD_STATS: `${API_BASE_URL}/users/dashboard-stats`
  },
  PRODUCTS: {
    ALL: `${API_BASE_URL}/products`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: `${API_BASE_URL}/products`,
    DELETE: `${API_BASE_URL}/products`,
    CATEGORIES: `${API_BASE_URL}/products/categories`
  },
  CATEGORIES: {
    ALL: `${API_BASE_URL}/categories`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id: number) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/categories/${id}`
  }
} as const; 