import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the current access token to every outgoing request.
client.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting token from SecureStore:', error);
    }
    return config;
});

// ─── Response Interceptor — Auto-Refresh on 401 ───────────────────────────────
// Queue of requests waiting for a token refresh to finish (race-condition guard).
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
    pendingQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    pendingQueue = [];
};

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh on 401 and only once per request (_retry flag)
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // Another refresh is already in flight — queue this request
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            })
                .then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return client(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Call the backend refresh endpoint (public — no auth header needed)
            const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const newAccessToken = data.accessToken;

            // Persist the new access token
            await SecureStore.setItemAsync('accessToken', newAccessToken);

            // Flush the queued requests with the new token
            processQueue(null, newAccessToken);

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return client(originalRequest);
        } catch (refreshError) {
            // Refresh failed — clear all credentials and force re-login
            processQueue(refreshError, null);
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default client;
