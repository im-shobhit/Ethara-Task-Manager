// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  // Make sure there is NO trailing slash at the end!
    baseURL: 'https://ethara-task-manager-production-a354.up.railway.app'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;