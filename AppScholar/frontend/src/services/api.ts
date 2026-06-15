import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ⚠️ Troque pelo seu IP
  timeout: 10000,
});

export default api;