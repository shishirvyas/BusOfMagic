import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useAdminAuth } from '@/context/AdminAuthContext';
/**
 * Component to conditionally render children based on user permissions
 */
export default function PermissionGate({ children, permission, permissions, requireAll = false, fallback = null, }) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useAdminAuth();
    // Check single permission
    if (permission) {
        if (!hasPermission(permission)) {
            return _jsx(_Fragment, { children: fallback });
        }
        return _jsx(_Fragment, { children: children });
    }
    // Check multiple permissions
    if (permissions && permissions.length > 0) {
        const hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
        if (!hasAccess) {
            return _jsx(_Fragment, { children: fallback });
        }
    }
    return _jsx(_Fragment, { children: children });
}
