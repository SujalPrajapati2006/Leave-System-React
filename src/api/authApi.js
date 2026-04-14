import axios from "axios";
import API_BASE_URL from "../api/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,          // ✅ sends HttpOnly cookie on every request
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login:        (data) => api.post("/auth/login", data),
  signup:       (data) => api.post("/auth/register", data),   // ✅ fixed
  refreshToken: ()     => api.post("/auth/refresh"),          // ✅ no body — cookie is sent automatically
  logout:       ()     => api.post("/auth/logout"),
};

export default authApi;