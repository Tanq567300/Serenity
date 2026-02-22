import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { login, register } from '../api/auth';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Initialize: Check for stored token
    initialize: async () => {
        set({ isLoading: true });
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                // Ideally, validate token with backend /me endpoint here
                set({ token, isAuthenticated: true });
            }
        } catch (e) {
            console.error('Failed to load token', e);
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const data = await login(email, password);
            const { accessToken, refreshToken, user } = data;

            await SecureStore.setItemAsync('accessToken', accessToken);
            if (refreshToken) {
                await SecureStore.setItemAsync('refreshToken', refreshToken);
            }

            set({
                token: accessToken,
                user: user,
                isAuthenticated: true,
                isLoading: false
            });
            return true;
        } catch (error) {
            set({
                error: error.message || 'Login failed',
                isLoading: false
            });
            return false;
        }
    },

    register: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
            await register(email, password, username);
            // Auto login after register? Or require login?
            // For now, require login or just succeed
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({
                error: error.message || 'Registration failed',
                isLoading: false
            });
            return false;
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    }
}));

export default useAuthStore;
