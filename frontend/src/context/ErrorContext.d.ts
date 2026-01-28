import { ReactNode } from 'react';
export interface ErrorMessage {
    id: string;
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
    timestamp: number;
}
interface ErrorContextType {
    errors: ErrorMessage[];
    addError: (title: string, message: string, type?: 'error' | 'warning' | 'info') => void;
    removeError: (id: string) => void;
    clearErrors: () => void;
}
export declare function ErrorProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useError(): ErrorContextType;
export {};
