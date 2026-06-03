import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-2-j5ns.onrender.com', // Render backend URL
});

// Add a request interceptor to include the auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
