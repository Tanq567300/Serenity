import client from '../api/client';

export const getUserPattern = async () => {
    try {
        const response = await client.get('/memory/pattern');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // 404 means no pattern generated yet (insufficient data)
            return null;
        }
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const recalculatePattern = async () => {
    try {
        const response = await client.post('/memory/pattern/recalculate');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
