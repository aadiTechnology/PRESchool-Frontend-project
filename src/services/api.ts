import axios from 'axios';

const api = axios.create({
  baseURL: 'http://apinew.smartkidzwakad.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors can be added here for request/response handling

export default api;