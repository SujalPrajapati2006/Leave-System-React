import { authService } from './authService';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = authService.getAccessToken();

  // Add authorization header if token exists
  if (accessToken && !options.headers?.['Authorization']) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };
  }

  try {
    const response = await fetch(url, options);

    // If unauthorized (401), try to refresh token
    if (response.status === 401) {
      if (isRefreshing) {
        // Wait for the token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            options.headers['Authorization'] = `Bearer ${token}`;
            return fetch(url, options);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = authService.getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Refresh the token
        const refreshResponse = await authService.refreshToken(refreshToken);
        const newAccessToken = refreshResponse.accessToken;

        processQueue(null, newAccessToken);

        // Retry the original request with new token
        options.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return fetch(url, options);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // If refresh fails, logout and redirect to login
        await authService.logout();
        window.location.href = '/';

        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default fetchWithAuth;