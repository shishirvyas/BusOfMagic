import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Box, CircularProgress } from '@mui/material';
export default function ProtectedRoute({ children, requiredPermission, requiredPermissions, requireAll = false, }) {
    const { isAuthenticated, isLoading, hasPermission, hasAnyPermission, hasAllPermissions } = useAdminAuth();
    const location = useLocation();
    // Show loading spinner while checking auth
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", children: _jsx(CircularProgress, {}) }));
    }
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // Check single permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    // Check multiple permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAccess = requireAll
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);
        if (!hasAccess) {
            return _jsx(Navigate, { to: "/unauthorized", replace: true });
        }
    }
    return _jsx(_Fragment, { children: children });
}
