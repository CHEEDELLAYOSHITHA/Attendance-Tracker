import axios from 'axios';

const API = axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/',
  // You can add headers or interceptors here if needed
});

export default API; 