import { ReactNode } from 'react';
interface AuthContextType {
    candidateId: string | null;
    registrationMethod: 'email' | 'phone' | null;
    registrationContact: string | null;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    setCandidateData: (data: Partial<AuthContextType>) => void;
    clearCandidateData: () => void;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
export {};
