import { ReactNode } from 'react';
import { LoginResponse, MenuItem } from '@/types/auth.types';
export interface UserContext {
    userId: number;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    roleName: string;
    stateId?: number;
    stateName?: string;
    cityId?: number;
    cityName?: string;
    permissions: string[];
}
interface AdminAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: LoginResponse | null;
    userContext: UserContext | null;
    permissions: string[];
    menuItems: MenuItem[];
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    isSuperAdmin: () => boolean;
    isStateAdmin: () => boolean;
    isCityAdmin: () => boolean;
    getUserStateId: () => number | null;
    getUserStateName: () => string | null;
    getUserCityId: () => number | null;
    getUserCityName: () => string | null;
}
export declare function AdminAuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAdminAuth(): AdminAuthContextType;
export declare function usePermission(permission: string): boolean;
export declare function usePermissions(permissions: string[], requireAll?: boolean): boolean;
export {};
