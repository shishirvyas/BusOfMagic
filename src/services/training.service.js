import apiClient from './api';
// ================== Training Master API ==================
export const trainingMasterApi = {
    // Get all trainings
    getAll: async () => {
        const response = await apiClient.get('/training/masters');
        return response.data;
    },
    // Get active trainings
    getActive: async () => {
        const response = await apiClient.get('/training/masters/active');
        return response.data;
    },
    // Get training by ID
    getById: async (id) => {
        const response = await apiClient.get(`/training/masters/${id}`);
        return response.data;
    },
    // Create training
    create: async (request) => {
        const response = await apiClient.post('/training/masters', request);
        return response.data;
    },
    // Update training
    update: async (id, request) => {
        const response = await apiClient.put(`/training/masters/${id}`, request);
        return response.data;
    },
    // Toggle active status
    toggleActive: async (id) => {
        const response = await apiClient.put(`/training/masters/${id}/toggle-active`);
        return response.data;
    },
    // Delete training
    delete: async (id) => {
        await apiClient.delete(`/training/masters/${id}`);
    },
    // Get skill categories
    getSkillCategories: async () => {
        const response = await apiClient.get('/training/skill-categories');
        return response.data;
    }
};
// ================== Training Batch API ==================
export const trainingBatchApi = {
    // Get all batches
    getAll: async () => {
        const response = await apiClient.get('/training/batches');
        return response.data;
    },
    // Get available batches (with capacity)
    getAvailable: async () => {
        const response = await apiClient.get('/training/batches/available');
        return response.data;
    },
    // Get upcoming batches
    getUpcoming: async () => {
        const response = await apiClient.get('/training/batches/upcoming');
        return response.data;
    },
    // Get batches by training ID
    getByTrainingId: async (trainingId) => {
        const response = await apiClient.get(`/training/masters/${trainingId}/batches`);
        return response.data;
    },
    // Get batch by ID
    getById: async (id) => {
        const response = await apiClient.get(`/training/batches/${id}`);
        return response.data;
    },
    // Create batch
    create: async (request) => {
        const response = await apiClient.post('/training/batches', request);
        return response.data;
    },
    // Update batch
    update: async (id, request) => {
        const response = await apiClient.put(`/training/batches/${id}`, request);
        return response.data;
    },
    // Toggle active status
    toggleActive: async (id) => {
        const response = await apiClient.put(`/training/batches/${id}/toggle-active`);
        return response.data;
    },
    // Delete batch
    delete: async (id) => {
        await apiClient.delete(`/training/batches/${id}`);
    }
};
