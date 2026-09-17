import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ig_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API services
export const authService = {
  login: async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  checkUsername: async (username) => {
    const response = await api.get(`/auth/check-username?username=${encodeURIComponent(username)}`);
    return response.data;
  },

  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;
