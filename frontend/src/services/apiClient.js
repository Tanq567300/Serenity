import client from '../api/client';

/**
 * Safe request wrapper — the single entry point for all API calls.
 *
 * Every network call in the app should go through this function so that
 * future resilience features (retries, offline detection, AI fallbacks)
 * can be added here without touching individual screens or services.
 *
 * The underlying `client` is the existing axios instance from api/client.js,
 * which already handles auth token injection and 401 auto-refresh.
 *
 * Usage:
 *   const result = await safeRequest(() => api.get('/some/endpoint'))
 *   if (!result.success) throw new Error(result.error)
 *   return result.data
 */
export async function safeRequest(requestFn) {
    try {
        const response = await requestFn();
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.warn('API Error:', error?.message);

        // Request timed out
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return {
                success: false,
                type: 'TIMEOUT_ERROR',
                message: 'Request timed out',
            };
        }

        // No response received — device offline or server unreachable
        if (!error.response) {
            return {
                success: false,
                type: 'NETWORK_ERROR',
                message: 'No internet connection',
            };
        }

        // Backend responded with an error status (4xx / 5xx)
        return {
            success: false,
            type: 'SERVER_ERROR',
            status: error.response?.status,
            message: error.response?.data?.message || 'Server error',
        };
    }
}

// Re-export the authenticated client as `api` so callers only need
// to import from this file and never touch api/client directly.
export default client;
