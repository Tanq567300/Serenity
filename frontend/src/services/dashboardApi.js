import client from '../api/client';

/**
 * Fetch aggregated dashboard data
 * @returns {Promise<Object>} Dashboard data (userName, moodScore, quote, latestJournal)
 */
export const getDashboardData = async () => {
    try {
        const response = await client.get('/dashboard');
        return response.data.data;
    } catch (error) {
        console.error('getDashboardData error:', error);
        throw error;
    }
};
