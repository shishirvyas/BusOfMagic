import apiClient from './api'

// ================== Types ==================

export interface TrainingMasterDTO {
  id: number
  name: string
  description: string
  skillCategory: string
  durationDays: number
  isActive: boolean
  totalBatches: number
  activeBatches: number
  createdAt: string
  updatedAt: string
}

export interface TrainingBatchDTO {
  id: number
  trainingId: number
  trainingName: string
  skillCategory: string
  batchCode: string
  startDate: string
  endDate: string
  maxCapacity: number
  currentEnrolled: number
  availableSlots: number
  location: string
  trainerName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTrainingRequest {
  name: string
  description: string
  skillCategory: string
  durationDays: number
}

export interface CreateBatchRequest {
  trainingId: number
  batchCode: string
  startDate: string
  endDate: string
  maxCapacity: number
  location: string
  trainerName: string
}

// ================== Training Master API ==================

export const trainingMasterApi = {
  // Get all trainings
  getAll: async (): Promise<TrainingMasterDTO[]> => {
    const response = await apiClient.get('/training/masters')
    return response.data
  },

  // Get active trainings
  getActive: async (): Promise<TrainingMasterDTO[]> => {
    const response = await apiClient.get('/training/masters/active')
    return response.data
  },

  // Get training by ID
  getById: async (id: number): Promise<TrainingMasterDTO> => {
    const response = await apiClient.get(`/training/masters/${id}`)
    return response.data
  },

  // Create training
  create: async (request: CreateTrainingRequest): Promise<TrainingMasterDTO> => {
    const response = await apiClient.post('/training/masters', request)
    return response.data
  },

  // Update training
  update: async (id: number, request: CreateTrainingRequest): Promise<TrainingMasterDTO> => {
    const response = await apiClient.put(`/training/masters/${id}`, request)
    return response.data
  },

  // Toggle active status
  toggleActive: async (id: number): Promise<TrainingMasterDTO> => {
    const response = await apiClient.put(`/training/masters/${id}/toggle-active`)
    return response.data
  },

  // Delete training
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/training/masters/${id}`)
  },

  // Get skill categories
  getSkillCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/training/skill-categories')
    return response.data
  }
}

// ================== Training Batch API ==================

export const trainingBatchApi = {
  // Get all batches
  getAll: async (): Promise<TrainingBatchDTO[]> => {
    const response = await apiClient.get('/training/batches')
    return response.data
  },

  // Get available batches (with capacity)
  getAvailable: async (): Promise<TrainingBatchDTO[]> => {
    const response = await apiClient.get('/training/batches/available')
    return response.data
  },

  // Get upcoming batches
  getUpcoming: async (): Promise<TrainingBatchDTO[]> => {
    const response = await apiClient.get('/training/batches/upcoming')
    return response.data
  },

  // Get batches by training ID
  getByTrainingId: async (trainingId: number): Promise<TrainingBatchDTO[]> => {
    const response = await apiClient.get(`/training/masters/${trainingId}/batches`)
    return response.data
  },

  // Get batch by ID
  getById: async (id: number): Promise<TrainingBatchDTO> => {
    const response = await apiClient.get(`/training/batches/${id}`)
    return response.data
  },

  // Create batch
  create: async (request: CreateBatchRequest): Promise<TrainingBatchDTO> => {
    const response = await apiClient.post('/training/batches', request)
    return response.data
  },

  // Update batch
  update: async (id: number, request: CreateBatchRequest): Promise<TrainingBatchDTO> => {
    const response = await apiClient.put(`/training/batches/${id}`, request)
    return response.data
  },

  // Toggle active status
  toggleActive: async (id: number): Promise<TrainingBatchDTO> => {
    const response = await apiClient.put(`/training/batches/${id}/toggle-active`)
    return response.data
  },

  // Delete batch
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/training/batches/${id}`)
  }
}
