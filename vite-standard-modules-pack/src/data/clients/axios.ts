import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8787', withCredentials: true });
export default api;
