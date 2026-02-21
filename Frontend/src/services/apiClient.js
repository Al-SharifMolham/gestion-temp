import axios from 'axios';
import storage from '../utils/storage';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000', // Adjust if backed is distinct
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        storage.clear();
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default apiClient;
