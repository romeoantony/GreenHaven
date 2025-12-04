import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const prodUrl = 'https://greenhaven-api-gfevg6efa5ghayde.southeastasia-01.azurewebsites.net/api';
const localUrl = 'http://localhost:5177/api'; // Or import.meta.env.VITE_API_URL if you prefer

const api = axios.create({
  baseURL: isLocal ? localUrl : prodUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
