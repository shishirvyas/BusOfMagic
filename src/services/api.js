import axios from 'axios';
import { dispatchSessionExpired } from '@/utils/api';
const API_BASE_URL = 'http://localhost:8080/api';
// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
apiClient.interceptors.request.use((config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor with error handling
apiClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle session expiration (401 Unauthorized or 403 Forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Session expired - dispatching session expired event');
        dispatchSessionExpired();
        return Promise.reject({
            success: false,
            message: 'Session expired. Please login again.',
            error: 'SESSION_EXPIRED',
        });
    }
    // Handle different error types
    if (!error.response) {
        // Network error or no response from server
        const errorObj = {
            success: false,
            message: error.message === 'timeout of 15000ms exceeded'
                ? 'Request timeout - server is not responding'
                : 'Network error - please check your connection',
            error: 'NETWORK_ERROR',
        };
        return Promise.reject(errorObj);
    }
    // Server returned error response
    const responseData = error.response.data;
    return Promise.reject(responseData);
});
// Utility function for safe API calls with error handling
export async function apiCall(method, url, data, config) {
    try {
        const response = await apiClient({
            method,
            url,
            data,
            ...config,
        });
        return {
            data: response.data,
            status: response.status,
        };
    }
    catch (error) {
        const apiError = error;
        return {
            error: apiError,
            status: 0,
        };
    }
}
export default apiClient;
