import apiClient from './api';
// ================== API Functions ==================
export const screeningApi = {
    // Get pending screening candidates
    getPendingScreening: async () => {
        const response = await apiClient.get('/screening/pending');
        return response.data;
    },
    // Get pending orientation candidates
    getPendingOrientation: async () => {
        const response = await apiClient.get('/screening/pending-orientation');
        return response.data;
    },
    // Get pending enrollment candidates
    getPendingEnrollment: async () => {
        const response = await apiClient.get('/screening/pending-enroll');
        return response.data;
    },
    // Get enrolled candidates
    getEnrolled: async () => {
        const response = await apiClient.get('/screening/enrolled');
        return response.data;
    },
    // Get workflow stats
    getStats: async () => {
        const response = await apiClient.get('/screening/stats');
        return response.data;
    },
    // Get workflow by ID
    getWorkflowById: async (id) => {
        const response = await apiClient.get(`/screening/${id}`);
        return response.data;
    },
    // Complete screening
    completeScreening: async (request, adminUserId) => {
        const response = await apiClient.put('/screening/complete-screening', request, {
            headers: { 'X-Admin-User-Id': adminUserId.toString() }
        });
        return response.data;
    },
    // Complete orientation
    completeOrientation: async (request, adminUserId) => {
        const response = await apiClient.put('/screening/complete-orientation', request, {
            headers: { 'X-Admin-User-Id': adminUserId.toString() }
        });
        return response.data;
    },
    // Enroll candidate
    enrollCandidate: async (request, adminUserId) => {
        const response = await apiClient.put('/screening/enroll', request, {
            headers: { 'X-Admin-User-Id': adminUserId.toString() }
        });
        return response.data;
    }
};
