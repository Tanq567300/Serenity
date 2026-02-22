import client from '../api/client';

/**
 * Fetch mood-personalized RSS articles from the backend.
 * The backend determines the mood from the user's recent entries automatically.
 * @returns {Promise<{ articles: Array, cacheStatus: string }>}
 */
export const getPersonalizedArticles = async () => {
    try {
        const response = await client.get('/articles/personalized');
        return response.data;
    } catch (error) {
        console.error('getPersonalizedArticles error:', error);
        throw error;
    }
};
