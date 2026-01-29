import { useAdminAuth } from '@/context/AdminAuthContext';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render children based on user permissions
 */
export default function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAdminAuth();

  // Check single permission
  if (permission) {
    if (!hasPermission(permission)) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
