import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting token', error);
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 triggers here (e.g. token refresh or logout)
        // For now just reject
        return Promise.reject(error);
    }
);

export default client;
