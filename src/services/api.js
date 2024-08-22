import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Ensure this points to your backend's base URL
  withCredentials: true, // Include credentials with requests
  timeout: 10000, // Request timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
