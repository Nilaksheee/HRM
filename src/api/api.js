import axios from 'axios';
import store from '../redux/store';

const api = axios.create({
  baseURL: 'https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/',
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.access;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;



