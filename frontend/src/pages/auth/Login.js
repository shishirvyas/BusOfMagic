import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, InputAdornment, IconButton, } from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAdminAuth } from '@/context/AdminAuthContext';
export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { login, isLoading } = useAdminAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');
    // Check if session expired
    useEffect(() => {
        if (searchParams.get('expired') === 'true') {
            setSessionExpiredMessage('Your session has expired. Please login again.');
            // Clear the expired param from URL
            window.history.replaceState({}, document.title, '/login');
        }
    }, [searchParams]);
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }
        try {
            const success = await login(username, password);
            if (success) {
                navigate(from, { replace: true });
            }
            else {
                setError('Login failed. Please check your credentials.');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        }
    };
    return (_jsx(Box, { sx: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 2,
        }, children: _jsx(Card, { sx: {
                maxWidth: 400,
                width: '100%',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsx(Box, { sx: { textAlign: 'center', mb: 3 }, children: _jsx("img", { src: "/assets/magic-bus-logo.png", alt: "Magic Bus Logo", style: { height: '60px', width: 'auto', objectFit: 'contain' } }) }), _jsx(Typography, { variant: "h5", component: "h1", align: "center", gutterBottom: true, sx: { fontWeight: 600 }, children: "Admin Login" }), _jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", sx: { mb: 3 }, children: "Sign in to access the dashboard" }), sessionExpiredMessage && (_jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: sessionExpiredMessage })), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, label: "Username", variant: "outlined", value: username, onChange: (e) => setUsername(e.target.value), disabled: isLoading, sx: { mb: 2 }, autoComplete: "username", autoFocus: true }), _jsx(TextField, { fullWidth: true, label: "Password", type: showPassword ? 'text' : 'password', variant: "outlined", value: password, onChange: (e) => setPassword(e.target.value), disabled: isLoading, sx: { mb: 3 }, autoComplete: "current-password", InputProps: {
                                    endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { onClick: () => setShowPassword(!showPassword), edge: "end", disabled: isLoading, children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) })),
                                } }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", disabled: isLoading, startIcon: isLoading ? _jsx(CircularProgress, { size: 20 }) : _jsx(LoginIcon, {}), sx: { py: 1.5 }, children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsxs(Box, { sx: {
                            mt: 3,
                            p: 2,
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                        }, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", display: "block", children: _jsx("strong", { children: "Demo Credentials:" }) }), _jsx(Typography, { variant: "caption", color: "text.secondary", display: "block", children: "Username: superadmin" }), _jsx(Typography, { variant: "caption", color: "text.secondary", display: "block", children: "Password: admin123" })] })] }) }) }));
}
