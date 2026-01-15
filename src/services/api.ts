import axios from 'axios';
import { API_URL } from '../constants/config';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;