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
export default function PermissionGate({ children, permission, permissions, requireAll, fallback, }: PermissionGateProps): import("react/jsx-runtime").JSX.Element;
export {};
