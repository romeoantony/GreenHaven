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

export default api;
