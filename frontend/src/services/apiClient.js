import client from '../api/client';

/** Resolves after `ms` milliseconds — used between retry attempts. */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safe request wrapper — the single entry point for all API calls.
 *
 * Automatically retries transient failures (network drops, timeouts) up to
 * `retries` times with a 1-second pause between attempts. Server errors
 * (4xx / 5xx) are NOT retried — the backend responded correctly, so there
 * is nothing to gain from repeating the request.
 *
 * The underlying `client` is the existing axios instance from api/client.js,
 * which already handles auth token injection and 401 auto-refresh.
 *
 * Usage:
 *   const result = await safeRequest(() => api.get('/some/endpoint'))
 *   if (!result.success) throw new Error(result.error)
 *   return result.data
 */
export async function safeRequest(requestFn, retries = 2) {
    try {
        const response = await requestFn();
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.warn('API Error:', error?.message);

        // Server responded with an error status (4xx / 5xx).
        // Do NOT retry — the backend handled the request; repeating it won't help.
        if (error.response) {
            return {
                success: false,
                type: 'SERVER_ERROR',
                status: error.response.status,
                message: error.response.data?.message || 'Server error',
            };
        }

        // Transient failure (timeout or no response) — retry if attempts remain.
        if (retries > 0) {
            console.warn(`Retrying request... (${retries} ${retries === 1 ? 'retry' : 'retries'} left)`);
            await delay(1000);
            return safeRequest(requestFn, retries - 1);
        }

        // All retries exhausted — classify the final error.
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return {
                success: false,
                type: 'TIMEOUT_ERROR',
                message: 'Request timed out',
            };
        }

        return {
            success: false,
            type: 'NETWORK_ERROR',
            message: 'No internet connection',
        };
    }
}

// Re-export the authenticated client as `api` so callers only need
// to import from this file and never touch api/client directly.
export default client;
