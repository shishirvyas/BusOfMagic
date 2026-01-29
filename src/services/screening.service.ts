import apiClient from './api'

// ================== Types ==================

export interface CandidateWorkflowDTO {
  id: number
  candidateId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  city: string
  state: string
  gender: string
  engagementScore: number | null
  dropoutRiskScore: number | null
  status: string
  statusDisplayName: string
  screeningCompletedAt: string | null
  screeningCompletedByName: string | null
  screeningNotes: string | null
  orientationCompletedAt: string | null
  orientationCompletedByName: string | null
  orientationNotes: string | null
  enrolledAt: string | null
  enrolledByName: string | null
  trainingBatchId: number | null
  trainingBatchCode: string | null
  trainingName: string | null
  enrollmentNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface ScreeningUpdateRequest {
  candidateWorkflowId: number
  notes: string
  approved: boolean
}

export interface OrientationUpdateRequest {
  candidateWorkflowId: number
  notes: string
  completed: boolean
}

export interface EnrollmentRequest {
  candidateWorkflowId: number
  trainingBatchId: number
  notes: string
}

export interface WorkflowStats {
  pendingScreening: number
  pendingOrientation: number
  pendingEnroll: number
  enrolled: number
  onHold: number
}

// ================== API Functions ==================

export const screeningApi = {
  // Get pending screening candidates
  getPendingScreening: async (): Promise<CandidateWorkflowDTO[]> => {
    const response = await apiClient.get('/screening/pending')
    return response.data
  },

  // Get pending orientation candidates
  getPendingOrientation: async (): Promise<CandidateWorkflowDTO[]> => {
    const response = await apiClient.get('/screening/pending-orientation')
    return response.data
  },

  // Get pending enrollment candidates
  getPendingEnrollment: async (): Promise<CandidateWorkflowDTO[]> => {
    const response = await apiClient.get('/screening/pending-enroll')
    return response.data
  },

  // Get enrolled candidates
  getEnrolled: async (): Promise<CandidateWorkflowDTO[]> => {
    const response = await apiClient.get('/screening/enrolled')
    return response.data
  },

  // Get workflow stats
  getStats: async (): Promise<WorkflowStats> => {
    const response = await apiClient.get('/screening/stats')
    return response.data
  },

  // Get workflow by ID
  getWorkflowById: async (id: number): Promise<CandidateWorkflowDTO> => {
    const response = await apiClient.get(`/screening/${id}`)
    return response.data
  },

  // Complete screening
  completeScreening: async (request: ScreeningUpdateRequest, adminUserId: number): Promise<CandidateWorkflowDTO> => {
    const response = await apiClient.put('/screening/complete-screening', request, {
      headers: { 'X-Admin-User-Id': adminUserId.toString() }
    })
    return response.data
  },

  // Complete orientation
  completeOrientation: async (request: OrientationUpdateRequest, adminUserId: number): Promise<CandidateWorkflowDTO> => {
    const response = await apiClient.put('/screening/complete-orientation', request, {
      headers: { 'X-Admin-User-Id': adminUserId.toString() }
    })
    return response.data
  },

  // Enroll candidate
  enrollCandidate: async (request: EnrollmentRequest, adminUserId: number): Promise<CandidateWorkflowDTO> => {
    const response = await apiClient.put('/screening/enroll', request, {
      headers: { 'X-Admin-User-Id': adminUserId.toString() }
    })
    return response.data
  }
}
