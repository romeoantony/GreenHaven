import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const prodUrl = 'https://greenhaven-api-gfevg6efa5ghayde.southeastasia-01.azurewebsites.net/api';
const localUrl = import.meta.env.VITE_API_URL || 'http://localhost:5177/api';

export const BASE_URL = import.meta.env.VITE_API_URL || (isLocal ? localUrl : prodUrl);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    try {
      const storage = localStorage.getItem('greenhaven-auth');
      if (storage) {
        const { state } = JSON.parse(storage);
        const token = state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (window.log) window.log(`Axios: Attached token ${token.substring(0, 10)}...`);
        } else {
          if (window.log) window.log('Axios: No token found in storage state');
        }
      } else {
        if (window.log) window.log('Axios: No storage found');
      }
    } catch (e) {
      console.error('Error parsing auth token', e);
      if (window.log) window.log(`Axios: Error parsing token: ${e.message}`);
    }
    if (window.log) window.log(`Axios: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
