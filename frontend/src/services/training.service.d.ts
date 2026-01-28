export interface TrainingMasterDTO {
    id: number;
    name: string;
    description: string;
    skillCategory: string;
    durationDays: number;
    isActive: boolean;
    totalBatches: number;
    activeBatches: number;
    createdAt: string;
    updatedAt: string;
}
export interface TrainingBatchDTO {
    id: number;
    trainingId: number;
    trainingName: string;
    skillCategory: string;
    batchCode: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    currentEnrolled: number;
    availableSlots: number;
    location: string;
    trainerName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CreateTrainingRequest {
    name: string;
    description: string;
    skillCategory: string;
    durationDays: number;
}
export interface CreateBatchRequest {
    trainingId: number;
    batchCode: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    location: string;
    trainerName: string;
}
export declare const trainingMasterApi: {
    getAll: () => Promise<TrainingMasterDTO[]>;
    getActive: () => Promise<TrainingMasterDTO[]>;
    getById: (id: number) => Promise<TrainingMasterDTO>;
    create: (request: CreateTrainingRequest) => Promise<TrainingMasterDTO>;
    update: (id: number, request: CreateTrainingRequest) => Promise<TrainingMasterDTO>;
    toggleActive: (id: number) => Promise<TrainingMasterDTO>;
    delete: (id: number) => Promise<void>;
    getSkillCategories: () => Promise<string[]>;
};
export declare const trainingBatchApi: {
    getAll: () => Promise<TrainingBatchDTO[]>;
    getAvailable: () => Promise<TrainingBatchDTO[]>;
    getUpcoming: () => Promise<TrainingBatchDTO[]>;
    getByTrainingId: (trainingId: number) => Promise<TrainingBatchDTO[]>;
    getById: (id: number) => Promise<TrainingBatchDTO>;
    create: (request: CreateBatchRequest) => Promise<TrainingBatchDTO>;
    update: (id: number, request: CreateBatchRequest) => Promise<TrainingBatchDTO>;
    toggleActive: (id: number) => Promise<TrainingBatchDTO>;
    delete: (id: number) => Promise<void>;
};
