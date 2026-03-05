import api, { safeRequest } from './apiClient';

/**
 * Fetch mood-personalized RSS articles from the backend.
 * The backend determines the mood from the user's recent entries automatically.
 * @returns {Promise<{ articles: Array, cacheStatus: string }>}
 */
export const getPersonalizedArticles = async () => {
    const result = await safeRequest(() => api.get('/articles/personalized'));
    if (!result.success) {
        console.warn('getPersonalizedArticles failed:', result.type);
        return { articles: [], cacheStatus: null };
    }
    return result.data;
};
