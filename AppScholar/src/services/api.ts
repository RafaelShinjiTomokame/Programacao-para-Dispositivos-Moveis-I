import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.100:3000/api', // ⚠️ Troque pelo IP da sua máquina na rede
  timeout: 10000,
});

export default api;