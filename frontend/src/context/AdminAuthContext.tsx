import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LoginResponse, MenuItem } from '@/types/auth.types';
import { authApi, menuApi } from '@/services/auth.service';

interface AdminAuthContextType {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: LoginResponse | null;
  permissions: string[];
  menuItems: MenuItem[];
  
  // Auth actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Permission checks
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  
  // Role checks
  isSuperAdmin: () => boolean;
  isStateAdmin: () => boolean;
  isCityAdmin: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'adminToken',
  USER: 'adminUser',
  USER_ID: 'adminUserId',
  PERMISSIONS: 'adminPermissions',
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser) as LoginResponse;
          setUser(parsedUser);
          setPermissions(parsedUser.permissions || []);
          setIsAuthenticated(true);
          
          // Fetch menu items
          await fetchMenuItems();
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await menuApi.getMenuForUser();
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ username, password });
      
      if (response.token) {
        // Store auth data
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response));
        localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId.toString());
        localStorage.setItem(STORAGE_KEYS.PERMISSIONS, response.permissions.join(','));
        
        setUser(response);
        setPermissions(response.permissions || []);
        setIsAuthenticated(true);
        
        // Fetch menu items after login
        await fetchMenuItems();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
    setUser(null);
    setPermissions([]);
    setMenuItems([]);
    setIsAuthenticated(false);
  };

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  }, []);

  // Permission check functions
  const hasPermission = useCallback((permission: string): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasAnyPermission = useCallback((requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(p => permissions.includes(p));
  }, [permissions]);

  const hasAllPermissions = useCallback((requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(p => permissions.includes(p));
  }, [permissions]);

  // Role check functions
  const isSuperAdmin = useCallback((): boolean => {
    return user?.roleName === 'SUPER_ADMIN';
  }, [user]);

  const isStateAdmin = useCallback((): boolean => {
    return user?.roleName === 'STATE_ADMIN';
  }, [user]);

  const isCityAdmin = useCallback((): boolean => {
    return user?.roleName === 'CITY_ADMIN';
  }, [user]);

  const value: AdminAuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    permissions,
    menuItems,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
    isStateAdmin,
    isCityAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Hook for checking specific permission
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAdminAuth();
  return hasPermission(permission);
}

// Hook for checking multiple permissions
export function usePermissions(permissions: string[], requireAll = false): boolean {
  const { hasAnyPermission, hasAllPermissions } = useAdminAuth();
  return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
}
