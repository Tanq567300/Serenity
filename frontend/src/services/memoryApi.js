import client from '../api/client';

/**
 * Fetch the daily memory for a specific date
 * @param {string|Date} date - Date object or ISO string
 * @returns {Promise<Object|null>} Memory object or null if not found
 */
export const getDailyMemory = async (date) => {
    try {
        const dateStr = date instanceof Date ? date.toISOString() : date;
        const response = await client.get(`/memory/daily/${dateStr}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // No memory exists for this date
        }
        console.error('getDailyMemory error:', error);
        throw error;
    }
};

/**
 * Fetch a list of recent daily memories
 * @param {number} limit 
 * @returns {Promise<Array>} Array of memory objects
 */
export const getMemories = async (limit = 7) => {
    try {
        const response = await client.get(`/memory/daily?limit=${limit}`);
        return response.data.data;
    } catch (error) {
        console.error('getMemories error:', error);
        throw error; // Let caller handle generic errors
    }
};
