import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Block as BlockIcon } from '@mui/icons-material';
export default function Unauthorized() {
    const navigate = useNavigate();
    return (_jsx(Box, { sx: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ef5350 0%, #f44336 100%)',
            p: 2,
        }, children: _jsx(Card, { sx: {
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
            }, children: _jsxs(CardContent, { sx: { p: 4 }, children: [_jsx(BlockIcon, { sx: { fontSize: 80, color: 'error.main', mb: 2 } }), _jsx(Typography, { variant: "h4", gutterBottom: true, children: "Access Denied" }), _jsx(Typography, { color: "text.secondary", sx: { mb: 3 }, children: "You don't have permission to access this page. Please contact your administrator if you believe this is an error." }), _jsxs(Box, { sx: { display: 'flex', gap: 2, justifyContent: 'center' }, children: [_jsx(Button, { variant: "outlined", onClick: () => navigate(-1), children: "Go Back" }), _jsx(Button, { variant: "contained", onClick: () => navigate('/dashboard'), children: "Go to Dashboard" })] })] }) }) }));
}
