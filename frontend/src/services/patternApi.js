import api, { safeRequest } from './apiClient';

/**
 * Fetch the user's computed mood pattern.
 * Returns null if no pattern exists yet (< 7 entries) or if the request fails.
 */
export const getUserPattern = async () => {
    const result = await safeRequest(() => api.get('/memory/pattern'));
    if (!result.success) {
        // 404 = insufficient data to generate a pattern (expected case)
        if (result.status === 404) return null;
        console.warn('getUserPattern failed:', result.type);
        return null;
    }
    return result.data;
};

/**
 * Trigger a manual pattern recalculation.
 * Throws on failure so the calling screen can surface an error to the user.
 */
export const recalculatePattern = async () => {
    const result = await safeRequest(() =>
        api.post('/memory/pattern/recalculate')
    );
    if (!result.success) {
        console.warn('recalculatePattern failed:', result.type);
        throw new Error(result.message || 'Failed to recalculate pattern');
    }
    return result.data;
};
