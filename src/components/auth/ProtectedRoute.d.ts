interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: string;
    requiredPermissions?: string[];
    requireAll?: boolean;
}
export default function ProtectedRoute({ children, requiredPermission, requiredPermissions, requireAll, }: ProtectedRouteProps): import("react/jsx-runtime").JSX.Element;
export {};
