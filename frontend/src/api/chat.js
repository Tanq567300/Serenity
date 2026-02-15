import client from './client';

export const startSession = async () => {
    try {
        const response = await client.post('/chat/new-session');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const sendMessage = async (sessionId, message) => {
    try {
        const response = await client.post('/chat/message', { sessionId, message });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getHistory = async (sessionId) => {
    try {
        const response = await client.get(`/chat/history/${sessionId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
