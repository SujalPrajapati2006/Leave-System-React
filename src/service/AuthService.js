import { API_ENDPOINTS, getAuthHeaders } from './apiConfig';

export const authService = {

  login: async (email, password) => {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      credentials: 'include',           // ✅ receive HttpOnly cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },

  signup: async (userData) => {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Sign up failed');
    return data;
  },

  refreshToken: async () => {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
      credentials: 'include',           // ✅ cookie sent automatically
      headers: { 'Content-Type': 'application/json' },
      // ✅ no body — backend reads cookie
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Token refresh failed');

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },

  logout: async () => {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',         // ✅ cookie sent so backend can revoke it
        headers: getAuthHeaders(),
      });
    } finally {
      // always clear local state even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated: () => !!localStorage.getItem('accessToken'),
  getAccessToken:  () => localStorage.getItem('accessToken'),
  getCurrentUser:  () => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },
};

export default authService;