import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL || 'https://gearguard-the-ultimate-maintenance.onrender.com/api';

export const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
client.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);
