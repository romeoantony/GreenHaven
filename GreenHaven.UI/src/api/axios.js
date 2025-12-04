import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const prodUrl = 'https://greenhaven-api-gfevg6efa5ghayde.southeastasia-01.azurewebsites.net/api';
const localUrl = 'http://localhost:5177/api'; // Or import.meta.env.VITE_API_URL if you prefer

export const BASE_URL = isLocal ? localUrl : prodUrl;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
