import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, menuApi } from '@/services/auth.service';
import { onSessionExpired } from '@/utils/api';
const AdminAuthContext = createContext(undefined);
const STORAGE_KEYS = {
    TOKEN: 'adminToken',
    USER: 'adminUser',
    USER_ID: 'adminUserId',
    PERMISSIONS: 'adminPermissions',
    USER_CONTEXT: 'adminUserContext',
};
export function AdminAuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userContext, setUserContext] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    // Build user context from login response
    const buildUserContext = (response) => {
        return {
            userId: response.userId,
            username: response.username,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            roleName: response.roleName,
            stateId: response.stateId,
            stateName: response.stateName,
            cityId: response.cityId,
            cityName: response.cityName,
            permissions: response.permissions || [],
        };
    };
    // Handle session expiration - redirect to login
    const handleSessionExpired = useCallback(() => {
        console.log('Session expired - redirecting to login');
        setUser(null);
        setUserContext(null);
        setPermissions([]);
        setMenuItems([]);
        setIsAuthenticated(false);
        // Redirect to login page
        window.location.href = '/login?expired=true';
    }, []);
    // Listen for session expiration events
    useEffect(() => {
        const unsubscribe = onSessionExpired(handleSessionExpired);
        return unsubscribe;
    }, [handleSessionExpired]);
    // Load user from localStorage on mount
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
                const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
                const storedContext = localStorage.getItem(STORAGE_KEYS.USER_CONTEXT);
                if (storedUser && storedToken) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setPermissions(parsedUser.permissions || []);
                    setIsAuthenticated(true);
                    // Restore user context
                    if (storedContext) {
                        setUserContext(JSON.parse(storedContext));
                    }
                    else {
                        setUserContext(buildUserContext(parsedUser));
                    }
                    // Fetch menu items
                    await fetchMenuItems();
                }
            }
            catch (error) {
                console.error('Error loading stored auth:', error);
                clearAuth();
            }
            finally {
                setIsLoading(false);
            }
        };
        loadStoredAuth();
    }, []);
    const fetchMenuItems = async () => {
        try {
            const items = await menuApi.getMenuForUser();
            setMenuItems(items);
        }
        catch (error) {
            console.error('Error fetching menu items:', error);
            setMenuItems([]);
        }
    };
    const login = async (username, password) => {
        try {
            setIsLoading(true);
            const response = await authApi.login({ username, password });
            if (response.token) {
                // Build user context
                const context = buildUserContext(response);
                // Store auth data
                localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response));
                localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId.toString());
                localStorage.setItem(STORAGE_KEYS.PERMISSIONS, response.permissions.join(','));
                localStorage.setItem(STORAGE_KEYS.USER_CONTEXT, JSON.stringify(context));
                setUser(response);
                setUserContext(context);
                setPermissions(response.permissions || []);
                setIsAuthenticated(true);
                console.log('User logged in with context:', context);
                // Fetch menu items after login
                await fetchMenuItems();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const clearAuth = () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
        localStorage.removeItem(STORAGE_KEYS.USER_CONTEXT);
        setUser(null);
        setUserContext(null);
        setPermissions([]);
        setMenuItems([]);
        setIsAuthenticated(false);
    };
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        }
        catch (error) {
            console.error('Logout error:', error);
        }
        finally {
            clearAuth();
        }
    }, []);
    // Permission check functions
    const hasPermission = useCallback((permission) => {
        return permissions.includes(permission);
    }, [permissions]);
    const hasAnyPermission = useCallback((requiredPermissions) => {
        return requiredPermissions.some(p => permissions.includes(p));
    }, [permissions]);
    const hasAllPermissions = useCallback((requiredPermissions) => {
        return requiredPermissions.every(p => permissions.includes(p));
    }, [permissions]);
    // Role check functions
    const isSuperAdmin = useCallback(() => {
        return user?.roleName === 'SUPER_ADMIN';
    }, [user]);
    const isStateAdmin = useCallback(() => {
        return user?.roleName === 'STATE_ADMIN';
    }, [user]);
    const isCityAdmin = useCallback(() => {
        return user?.roleName === 'CITY_ADMIN';
    }, [user]);
    // Location getter functions
    const getUserStateId = useCallback(() => {
        return userContext?.stateId ?? null;
    }, [userContext]);
    const getUserStateName = useCallback(() => {
        return userContext?.stateName ?? null;
    }, [userContext]);
    const getUserCityId = useCallback(() => {
        return userContext?.cityId ?? null;
    }, [userContext]);
    const getUserCityName = useCallback(() => {
        return userContext?.cityName ?? null;
    }, [userContext]);
    const value = {
        isAuthenticated,
        isLoading,
        user,
        userContext,
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
        getUserStateId,
        getUserStateName,
        getUserCityId,
        getUserCityName,
    };
    return (_jsx(AdminAuthContext.Provider, { value: value, children: children }));
}
export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
// Hook for checking specific permission
export function usePermission(permission) {
    const { hasPermission } = useAdminAuth();
    return hasPermission(permission);
}
// Hook for checking multiple permissions
export function usePermissions(permissions, requireAll = false) {
    const { hasAnyPermission, hasAllPermissions } = useAdminAuth();
    return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
}
