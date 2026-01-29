type FetchOptions = RequestInit & {
    skipAuthCheck?: boolean;
};
export declare const dispatchSessionExpired: () => void;
export declare const onSessionExpired: (callback: () => void) => () => void;
export declare const getAuthHeaders: () => HeadersInit;
export declare const clearAuthData: () => void;
export declare const authFetch: (url: string, options?: FetchOptions) => Promise<Response>;
export declare const api: {
    get: <T>(url: string, options?: FetchOptions) => Promise<T>;
    post: <T>(url: string, data?: unknown, options?: FetchOptions) => Promise<T>;
    put: <T>(url: string, data?: unknown, options?: FetchOptions) => Promise<T>;
    delete: <T>(url: string, options?: FetchOptions) => Promise<T>;
};
export {};
