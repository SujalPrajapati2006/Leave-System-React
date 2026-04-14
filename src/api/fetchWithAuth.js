import { authService } from './authService';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = authService.getAccessToken();

  options.credentials = 'include';      // ✅ always include cookies
  options.headers = {
    ...options.headers,
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };

  const response = await fetch(url, options);

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        options.headers['Authorization'] = `Bearer ${token}`;
        return fetch(url, options);
      });
    }

    isRefreshing = true;

    try {
      // ✅ no token argument — cookie is sent automatically
      const refreshData = await authService.refreshToken();
      const newToken = refreshData.accessToken;

      processQueue(null, newToken);

      options.headers['Authorization'] = `Bearer ${newToken}`;
      return fetch(url, options);
    } catch (err) {
      processQueue(err, null);
      await authService.logout();
      window.location.href = '/';
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};

export default fetchWithAuth;