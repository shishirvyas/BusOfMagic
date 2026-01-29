import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ErrorProvider } from '@context/ErrorContext';
import { AuthProvider } from '@context/AuthContext';
import { AdminAuthProvider } from '@context/AdminAuthContext';
import ErrorNotification from '@components/common/ErrorNotification';
import { ProtectedRoute } from '@components/auth';
import Layout from '@components/layout/Layout';
// Pages
import Dashboard from '@pages/Dashboard';
import Customers from '@pages/Customers';
import Settings from '@pages/Settings';
import Locations from '@pages/Locations';
import IndividualSignup from '@pages/auth/IndividualSignup';
import Login from '@pages/auth/Login';
import Unauthorized from '@pages/auth/Unauthorized';
import Onboarding from '@pages/Onboarding';
import { AdminManagement, RoleManagement, PermissionManagement } from '@pages/admin';
import { UnderScreening, Orientation, Enroll } from '@pages/screening';
import { TrainingMaster, TrainingBatches } from '@pages/training';
import TrainingCalendar from '@pages/training/TrainingCalendar';
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});
function App() {
    return (_jsx(ErrorProvider, { children: _jsx(AuthProvider, { children: _jsx(AdminAuthProvider, { children: _jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(ErrorNotification, {}), _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/unauthorized", element: _jsx(Unauthorized, {}) }), _jsx(Route, { path: "/individualsignup", element: _jsx(IndividualSignup, {}) }), _jsx(Route, { path: "/onboard", element: _jsx(Onboarding, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "customers", element: _jsx(Customers, {}) }), _jsx(Route, { path: "locations", element: _jsx(Locations, {}) }), _jsx(Route, { path: "settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "onboarding", element: _jsx(Onboarding, {}) }), _jsx(Route, { path: "under-screening", element: _jsx(ProtectedRoute, { requiredPermission: "SCREENING_VIEW", children: _jsx(UnderScreening, {}) }) }), _jsx(Route, { path: "orientation", element: _jsx(ProtectedRoute, { requiredPermission: "SCREENING_VIEW", children: _jsx(Orientation, {}) }) }), _jsx(Route, { path: "enroll", element: _jsx(ProtectedRoute, { requiredPermission: "SCREENING_MANAGE", children: _jsx(Enroll, {}) }) }), _jsx(Route, { path: "admin-management", element: _jsx(ProtectedRoute, { requiredPermission: "ADMIN_MANAGE", children: _jsx(AdminManagement, {}) }) }), _jsx(Route, { path: "role-management", element: _jsx(ProtectedRoute, { requiredPermission: "ROLE_MANAGE", children: _jsx(RoleManagement, {}) }) }), _jsx(Route, { path: "permission-management", element: _jsx(ProtectedRoute, { requiredPermission: "PERMISSION_MANAGE", children: _jsx(PermissionManagement, {}) }) }), _jsx(Route, { path: "training-master", element: _jsx(ProtectedRoute, { requiredPermission: "TRAINING_MANAGE", children: _jsx(TrainingMaster, {}) }) }), _jsx(Route, { path: "training-batches", element: _jsx(ProtectedRoute, { requiredPermission: "TRAINING_MANAGE", children: _jsx(TrainingBatches, {}) }) }), _jsx(Route, { path: "training-calendar", element: _jsx(ProtectedRoute, { requiredPermission: "TRAINING_VIEW", children: _jsx(TrainingCalendar, {}) }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) })] }) }) }) }));
}
export default App;
