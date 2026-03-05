import api, { safeRequest } from './apiClient';

/**
 * Fetch aggregated dashboard data
 * @returns {Promise<Object|null>} Dashboard data (userName, moodScore, quote, latestJournal), or null on failure
 */
export const getDashboardData = async () => {
    const result = await safeRequest(() => api.get('/dashboard'));
    if (!result.success) {
        console.warn('getDashboardData failed:', result.type);
        return null;
    }
    return result.data.data;
};
