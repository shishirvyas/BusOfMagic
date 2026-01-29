import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, ToggleButton, ToggleButtonGroup, Typography, Container, Alert, CircularProgress, } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
export default function SignupForm({ onSubmit, isLoading = false }) {
    const [contactType, setContactType] = useState('email');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const validateMobile = (mobile) => {
        return /^\d{10}$/.test(mobile.replace(/\D/g, ''));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!contact.trim()) {
            setError(`Please enter your ${contactType}`);
            return;
        }
        if (contactType === 'email' && !validateEmail(contact)) {
            setError('Please enter a valid email address');
            return;
        }
        if (contactType === 'mobile' && !validateMobile(contact)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        onSubmit(contact, contactType);
    };
    return (_jsx(Container, { maxWidth: "sm", children: _jsx(Box, { sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                py: 4,
            }, children: _jsx(Card, { sx: {
                    width: '100%',
                    boxShadow: 3,
                }, children: _jsxs(CardContent, { sx: { p: { xs: 2, sm: 3 } }, children: [_jsx(Box, { sx: { textAlign: 'center', mb: 4 }, children: _jsx("img", { src: "/assets/magic-bus-logo.png", alt: "Magic Bus Logo", style: { height: '60px', width: 'auto', objectFit: 'contain' } }) }), _jsxs(Box, { sx: { mb: 3, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h4", component: "h1", sx: { fontWeight: 'bold', mb: 1 }, children: "Create Account" }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: "Join Magic Bus and get started" })] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "subtitle2", sx: { mb: 2, fontWeight: 600 }, children: "Register with:" }), _jsxs(ToggleButtonGroup, { value: contactType, exclusive: true, onChange: (e, newType) => {
                                        if (newType) {
                                            setContactType(newType);
                                            setContact('');
                                            setError('');
                                        }
                                    }, fullWidth: true, sx: {
                                        '& .MuiToggleButton-root': {
                                            flex: 1,
                                        },
                                    }, children: [_jsxs(ToggleButton, { value: "email", "aria-label": "email", children: [_jsx(EmailIcon, { sx: { mr: 1 } }), "Email"] }), _jsxs(ToggleButton, { value: "mobile", "aria-label": "mobile", children: [_jsx(PhoneIcon, { sx: { mr: 1 } }), "Mobile"] })] })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, label: contactType === 'email' ? 'Email Address' : 'Mobile Number', placeholder: contactType === 'email' ? 'you@example.com' : '10-digit mobile number', value: contact, onChange: (e) => {
                                        setContact(e.target.value);
                                        setError('');
                                    }, type: contactType === 'email' ? 'email' : 'tel', disabled: isLoading, sx: { mb: 3 }, variant: "outlined", size: "medium" }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", disabled: isLoading, sx: {
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                    }, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(CircularProgress, { size: 20, sx: { mr: 1 } }), "Sending OTP..."] })) : ('Send OTP') })] }), _jsx(Box, { sx: { mt: 3, textAlign: 'center' }, children: _jsxs(Typography, { variant: "body2", color: "textSecondary", children: ["Already have an account?", ' ', _jsx(Typography, { component: "a", href: "/auth/sign-in", sx: {
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }, children: "Sign In" })] }) })] }) }) }) }));
}
