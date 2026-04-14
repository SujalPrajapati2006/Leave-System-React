const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default API_BASE_URL;