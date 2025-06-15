export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    PROFILE: '/users/profile'
  },
  USERS: {
    ALL: '/users/all',
    APPROVE: (id: number) => `/users/${id}/approve`,
    REJECT: (id: number) => `/users/${id}/reject`,
    ROLE: (id: number) => `/users/${id}/role`,
    DEACTIVATE: (id: number) => `/users/${id}/deactivate`,
    REACTIVATE: (id: number) => `/users/${id}/reactivate`,
    PENDING: '/users/pending',
    UPDATE_ROLE: '/users/all',
    DASHBOARD_STATS: '/users/dashboard-stats'
  },
  PRODUCTS: {
    ALL: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    CATEGORIES: '/products/categories'
  }
} as const; 