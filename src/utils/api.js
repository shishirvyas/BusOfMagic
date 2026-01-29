// API utility with session expiration handling
// Event for session expiration
const SESSION_EXPIRED_EVENT = 'session-expired';
// Dispatch session expired event
export const dispatchSessionExpired = () => {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
};
// Subscribe to session expired event
export const onSessionExpired = (callback) => {
    window.addEventListener(SESSION_EXPIRED_EVENT, callback);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, callback);
};
// Helper to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    const userId = localStorage.getItem('adminUserId');
    const permissions = localStorage.getItem('adminPermissions');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
        ...(userId && { 'X-User-Id': userId }),
        ...(permissions && { 'X-User-Permissions': permissions }),
    };
};
// Clear auth data from localStorage
export const clearAuthData = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminUserId');
    localStorage.removeItem('adminPermissions');
    localStorage.removeItem('adminUserContext');
};
// Authenticated fetch wrapper with session expiration handling
export const authFetch = async (url, options = {}) => {
    const { skipAuthCheck, ...fetchOptions } = options;
    const response = await fetch(url, {
        ...fetchOptions,
        headers: {
            ...getAuthHeaders(),
            ...fetchOptions.headers,
        },
    });
    // Check for session expiration (401 Unauthorized or 403 Forbidden)
    if (!skipAuthCheck && (response.status === 401 || response.status === 403)) {
        // Clear stored auth data
        clearAuthData();
        // Dispatch session expired event
        dispatchSessionExpired();
        throw new Error('Session expired. Please login again.');
    }
    return response;
};
// Helper methods for common HTTP operations
export const api = {
    get: async (url, options) => {
        const response = await authFetch(url, { ...options, method: 'GET' });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || 'Request failed');
        }
        return response.json();
    },
    post: async (url, data, options) => {
        const response = await authFetch(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || 'Request failed');
        }
        return response.json();
    },
    put: async (url, data, options) => {
        const response = await authFetch(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || 'Request failed');
        }
        return response.json();
    },
    delete: async (url, options) => {
        const response = await authFetch(url, { ...options, method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || 'Request failed');
        }
        return response.json();
    },
};
