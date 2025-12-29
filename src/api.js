// src/api.js
import axios from 'axios'


const API_URL = 'https://sansonmart-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;