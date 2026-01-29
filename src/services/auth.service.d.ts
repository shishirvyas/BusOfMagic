import { LoginRequest, LoginResponse, AdminUser, CreateAdminRequest, Role, MenuItem, MenuGroup, Permission, CreateRoleRequest } from '@/types/auth.types';
export declare const authApi: {
    login: (credentials: LoginRequest) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    validateSession: () => Promise<{
        valid: boolean;
    }>;
};
export declare const adminApi: {
    getAll: () => Promise<AdminUser[]>;
    getById: (id: number) => Promise<AdminUser>;
    getByState: (stateId: number) => Promise<AdminUser[]>;
    getByCity: (cityId: number) => Promise<AdminUser[]>;
    create: (data: CreateAdminRequest) => Promise<AdminUser>;
    update: (id: number, data: CreateAdminRequest) => Promise<AdminUser>;
    toggleStatus: (id: number) => Promise<void>;
    delete: (id: number) => Promise<void>;
};
export declare const roleApi: {
    getAll: () => Promise<Role[]>;
    getActive: () => Promise<Role[]>;
    getById: (id: number) => Promise<Role>;
    create: (data: CreateRoleRequest) => Promise<Role>;
    update: (id: number, data: Partial<CreateRoleRequest>) => Promise<Role>;
    updatePermissions: (id: number, permissionCodes: string[]) => Promise<Role>;
    delete: (id: number) => Promise<void>;
    toggleStatus: (id: number) => Promise<void>;
};
export declare const permissionApi: {
    getAll: () => Promise<Permission[]>;
    getActive: () => Promise<Permission[]>;
    getGroupedByModule: () => Promise<Record<string, Permission[]>>;
};
export declare const menuApi: {
    getMenuForUser: () => Promise<MenuItem[]>;
    getGroupedMenu: () => Promise<MenuGroup[]>;
    getAllMenuItems: () => Promise<MenuItem[]>;
    getAllMenuGroups: () => Promise<MenuGroup[]>;
};
