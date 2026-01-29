export interface CandidateWorkflowDTO {
    id: number;
    candidateId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    city: string;
    state: string;
    gender: string;
    engagementScore: number | null;
    dropoutRiskScore: number | null;
    status: string;
    statusDisplayName: string;
    screeningCompletedAt: string | null;
    screeningCompletedByName: string | null;
    screeningNotes: string | null;
    orientationCompletedAt: string | null;
    orientationCompletedByName: string | null;
    orientationNotes: string | null;
    enrolledAt: string | null;
    enrolledByName: string | null;
    trainingBatchId: number | null;
    trainingBatchCode: string | null;
    trainingName: string | null;
    enrollmentNotes: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface ScreeningUpdateRequest {
    candidateWorkflowId: number;
    notes: string;
    approved: boolean;
}
export interface OrientationUpdateRequest {
    candidateWorkflowId: number;
    notes: string;
    completed: boolean;
}
export interface EnrollmentRequest {
    candidateWorkflowId: number;
    trainingBatchId: number;
    notes: string;
}
export interface WorkflowStats {
    pendingScreening: number;
    pendingOrientation: number;
    pendingEnroll: number;
    enrolled: number;
    onHold: number;
}
export declare const screeningApi: {
    getPendingScreening: () => Promise<CandidateWorkflowDTO[]>;
    getPendingOrientation: () => Promise<CandidateWorkflowDTO[]>;
    getPendingEnrollment: () => Promise<CandidateWorkflowDTO[]>;
    getEnrolled: () => Promise<CandidateWorkflowDTO[]>;
    getStats: () => Promise<WorkflowStats>;
    getWorkflowById: (id: number) => Promise<CandidateWorkflowDTO>;
    completeScreening: (request: ScreeningUpdateRequest, adminUserId: number) => Promise<CandidateWorkflowDTO>;
    completeOrientation: (request: OrientationUpdateRequest, adminUserId: number) => Promise<CandidateWorkflowDTO>;
    enrollCandidate: (request: EnrollmentRequest, adminUserId: number) => Promise<CandidateWorkflowDTO>;
};
