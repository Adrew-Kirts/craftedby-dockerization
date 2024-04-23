import axios from 'axios';

const token = localStorage.getItem('token') || null;

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/`,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
