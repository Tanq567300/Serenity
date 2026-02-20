import client from '../api/client';

/**
 * Fetch the daily memory for a specific date
 */
export const getDailyMemory = async (date) => {
    try {
        const dateStr = date instanceof Date ? date.toISOString() : date;
        const response = await client.get(`/memory/daily/${dateStr}`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('getDailyMemory error:', error);
        throw error;
    }
};

/**
 * Fetch a list of recent daily memories (paginated)
 */
export const getMemories = async (page = 1, limit = 10) => {
    try {
        const response = await client.get(`/memory/daily?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('getMemories error:', error);
        throw error;
    }
};

/**
 * Submit a handwritten journal entry for AI analysis and storage
 * @param {{ text: string, moodScore: number, date?: string }} params
 */
export const createJournalEntry = async ({ text, moodScore, date }) => {
    try {
        const response = await client.post('/memory/journal', { text, moodScore, date });
        return response.data.data;
    } catch (error) {
        console.error('createJournalEntry error:', error);
        throw error;
    }
};
