import { LoginRequest, LoginResponse, AdminUser, CreateAdminRequest, Role, MenuItem, MenuGroup, Permission, CreateRoleRequest } from '@/types/auth.types';

const API_BASE = '/api';

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken');
  const userId = localStorage.getItem('adminUserId');
  const permissions = localStorage.getItem('adminPermissions');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': token }),
    ...(userId && { 'X-User-Id': userId }),
    ...(permissions && { 'X-User-Permissions': permissions }),
  };
};

// ==================== AUTH ENDPOINTS ====================

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  validateSession: async (): Promise<{ valid: boolean }> => {
    const response = await fetch(`${API_BASE}/auth/validate`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// ==================== ADMIN MANAGEMENT ENDPOINTS ====================

export const adminApi = {
  getAll: async (): Promise<AdminUser[]> => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admins');
    return response.json();
  },

  getById: async (id: number): Promise<AdminUser> => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admin');
    return response.json();
  },

  getByState: async (stateId: number): Promise<AdminUser[]> => {
    const response = await fetch(`${API_BASE}/admin/users/state/${stateId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admins');
    return response.json();
  },

  getByCity: async (cityId: number): Promise<AdminUser[]> => {
    const response = await fetch(`${API_BASE}/admin/users/city/${cityId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch admins');
    return response.json();
  },

  create: async (data: CreateAdminRequest): Promise<AdminUser> => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create admin');
    }
    return response.json();
  },

  update: async (id: number, data: CreateAdminRequest): Promise<AdminUser> => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update admin');
    return response.json();
  },

  toggleStatus: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle admin status');
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete admin');
  },
};

// ==================== ROLE ENDPOINTS ====================

export const roleApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await fetch(`${API_BASE}/roles`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
  },

  getActive: async (): Promise<Role[]> => {
    const response = await fetch(`${API_BASE}/roles/active`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
  },

  getById: async (id: number): Promise<Role> => {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch role');
    return response.json();
  },

  create: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create role');
    }
    return response.json();
  },

  update: async (id: number, data: Partial<CreateRoleRequest>): Promise<Role> => {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update role');
    return response.json();
  },

  updatePermissions: async (id: number, permissionCodes: string[]): Promise<Role> => {
    const response = await fetch(`${API_BASE}/roles/${id}/permissions`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(permissionCodes),
    });
    if (!response.ok) throw new Error('Failed to update role permissions');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete role');
  },

  toggleStatus: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/roles/${id}/toggle-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle role status');
  },
};

// ==================== PERMISSION ENDPOINTS ====================

export const permissionApi = {
  getAll: async (): Promise<Permission[]> => {
    const response = await fetch(`${API_BASE}/roles/permissions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch permissions');
    return response.json();
  },

  getActive: async (): Promise<Permission[]> => {
    const response = await fetch(`${API_BASE}/roles/permissions/active`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch permissions');
    return response.json();
  },

  getGroupedByModule: async (): Promise<Record<string, Permission[]>> => {
    const response = await fetch(`${API_BASE}/roles/permissions/grouped`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch permissions');
    return response.json();
  },
};

// ==================== MENU ENDPOINTS ====================

export const menuApi = {
  getMenuForUser: async (): Promise<MenuItem[]> => {
    const response = await fetch(`${API_BASE}/menu`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
  },

  getGroupedMenu: async (): Promise<MenuGroup[]> => {
    const response = await fetch(`${API_BASE}/menu/grouped`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch grouped menu');
    return response.json();
  },

  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await fetch(`${API_BASE}/menu/all`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return response.json();
  },

  getAllMenuGroups: async (): Promise<MenuGroup[]> => {
    const response = await fetch(`${API_BASE}/menu/groups`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch menu groups');
    return response.json();
  },
};
