export interface Permission {
    id: number;
    name: string;
    code: string;
    description?: string;
    module?: string;
    isActive?: boolean;
}
export interface Role {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    permissions: string[];
}
export interface AdminUser {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roleId: number;
    roleName: string;
    stateId?: number;
    stateName?: string;
    cityId?: number;
    cityName?: string;
    isActive: boolean;
    lastLogin?: string;
    createdById?: number;
    createdByName?: string;
    createdAt?: string;
    permissions: string[];
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
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
    token: string;
    message: string;
}
export interface CreateAdminRequest {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roleId: number;
    stateId?: number;
    cityId?: number;
}
export interface MenuItem {
    id: number;
    name: string;
    label: string;
    icon: string;
    path: string;
    parentId?: number;
    menuGroupId?: number;
    menuGroupName?: string;
    sortOrder: number;
    requiredPermission?: string;
    isActive: boolean;
    children?: MenuItem[];
}
export interface MenuGroup {
    id: number;
    name: string;
    label: string;
    icon: string;
    sortOrder: number;
    isActive: boolean;
    menuItems: MenuItem[];
}
export interface CreateRoleRequest {
    name: string;
    description?: string;
    permissions: string[];
}
export interface UpdateRolePermissionsRequest {
    permissionCodes: string[];
}
