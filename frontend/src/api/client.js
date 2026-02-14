import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// NOTE: For Android Emulator usa '10.0.2.2' instead of 'localhost'
// For iOS Simulator or Web 'localhost' is fine.
// Adjust this based on where you are running the app.
const BASE_URL = 'http://localhost:5012/api';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
