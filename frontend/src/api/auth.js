import client from './client';

export const login = async (email, password) => {
    try {
        const response = await client.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const register = async (email, password, username) => {
    try {
        const response = await client.post('/auth/register', { email, password, username });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const logout = async () => {
    // Optional: Call logout endpoint if backend requires it
    return true;
};
