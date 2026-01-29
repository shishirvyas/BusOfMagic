import apiClient from './api'

// ================== Types ==================

export interface OnboardingAgingNotification {
  id: number
  candidateId: number
  candidateName: string
  phoneNumber: string
  onboardingStatus: string
  daysSinceCreated: number
  agingLevel: string
  agingColor: 'GREEN' | 'AMBER' | 'RED'
  message: string
  isRead: boolean
  createdAt: string
}

export interface NotificationSummary {
  byColor: Record<string, number>
  byStatus: Record<string, number>
  unreadCount: number
  totalActive: number
}

// ================== API Functions ==================

export const notificationApi = {
  // Get all active notifications
  getAll: async (): Promise<OnboardingAgingNotification[]> => {
    const response = await apiClient.get('/notifications')
    return response.data
  },

  // Get unread count for badge
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count')
    return response.data.count
  },

  // Get notifications by color filter
  getByColor: async (color: string): Promise<OnboardingAgingNotification[]> => {
    const response = await apiClient.get(`/notifications/by-color/${color}`)
    return response.data
  },

  // Get notifications by onboarding status
  getByStatus: async (status: string): Promise<OnboardingAgingNotification[]> => {
    const response = await apiClient.get(`/notifications/by-status/${status}`)
    return response.data
  },

  // Get summary statistics
  getSummary: async (): Promise<NotificationSummary> => {
    const response = await apiClient.get('/notifications/summary')
    return response.data
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/mark-all-read')
  },

  // Dismiss a notification
  dismiss: async (id: number): Promise<void> => {
    await apiClient.put(`/notifications/${id}/dismiss`)
  },

  // Manually trigger calculation (for testing)
  triggerCalculation: async (): Promise<void> => {
    await apiClient.post('/notifications/calculate')
  },
}
