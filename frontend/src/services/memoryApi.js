import api, { safeRequest } from './apiClient';

/**
 * Fetch the daily memory for a specific date.
 * Returns null if no entry exists for that date or if the request fails.
 */
export const getDailyMemory = async (date) => {
    const dateStr = date instanceof Date ? date.toISOString() : date;
    const result = await safeRequest(() => api.get(`/memory/daily/${dateStr}`));
    if (!result.success) {
        // 404 = no memory for that date, treat as null (expected case)
        if (result.status === 404) return null;
        console.warn('getDailyMemory failed:', result.type);
        return null;
    }
    return result.data.data;
};

/**
 * Fetch a list of recent daily memories (paginated).
 * Returns an empty page shape on failure so the list renders empty without crashing.
 */
export const getMemories = async (page = 1, limit = 10) => {
    const result = await safeRequest(() =>
        api.get(`/memory/daily?page=${page}&limit=${limit}`)
    );
    if (!result.success) {
        console.warn('getMemories failed:', result.type);
        return { data: [], pagination: { current: 1, pages: 0 } };
    }
    return result.data;
};

/**
 * Submit a handwritten journal entry for AI analysis and storage.
 * Throws on failure so the calling screen can surface an error Alert to the user.
 * @param {{ text: string, moodScore: number, date?: string }} params
 */
export const createJournalEntry = async ({ text, moodScore, date }) => {
    const result = await safeRequest(() =>
        api.post('/memory/journal', { text, moodScore, date })
    );
    if (!result.success) {
        console.warn('createJournalEntry failed:', result.type);
        throw new Error(result.message || 'Failed to save journal entry');
    }
    return result.data.data;
};
