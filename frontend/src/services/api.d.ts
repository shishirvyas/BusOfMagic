export interface ApiErrorResponse {
    success: false;
    message: string;
    error: string;
    errors?: any[];
}
export interface ApiSuccessResponse<T> {
    success: true;
    [key: string]: any;
}
export interface ApiResponse<T> {
    data?: T;
    error?: ApiErrorResponse;
    status: number;
}
declare const apiClient: import("axios").AxiosInstance;
export declare function apiCall<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
export default apiClient;
