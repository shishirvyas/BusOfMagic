import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Container, Alert, CircularProgress, } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '@context/AuthContext';
export default function CompleteSignup({ contact, contactType, onSubmit, isLoading = false, }) {
    const { setCandidateData } = useAuth();
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!fullName.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (fullName.trim().length < 3) {
            setError('Full name must be at least 3 characters');
            return;
        }
        if (!dateOfBirth) {
            setError('Please select your date of birth');
            return;
        }
        // Parse first and last name from full name
        const parts = fullName.trim().split(' ');
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ');
        // Store in context
        setCandidateData({
            firstName,
            lastName,
            dateOfBirth,
        });
        onSubmit({
            fullName: fullName.trim(),
            dateOfBirth,
            contact,
            contactType,
        });
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
                }, children: _jsxs(CardContent, { sx: { p: { xs: 2, sm: 3 } }, children: [_jsx(Box, { sx: { textAlign: 'center', mb: 4 }, children: _jsx("img", { src: "/assets/magic-bus-logo.png", alt: "Magic Bus Logo", style: { height: '60px', width: 'auto', objectFit: 'contain' } }) }), _jsx(Box, { sx: { textAlign: 'center', mb: 3 }, children: _jsx(CheckCircleIcon, { sx: {
                                    fontSize: 60,
                                    color: 'success.main',
                                    mb: 2,
                                } }) }), _jsxs(Box, { sx: { mb: 3, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h5", component: "h1", sx: { fontWeight: 'bold', mb: 1 }, children: "Almost There!" }), _jsx(Typography, { variant: "body2", color: "textSecondary", children: "Let us know your name to complete your profile" })] }), _jsx(Alert, { severity: "success", sx: { mb: 3 }, children: _jsxs(Typography, { variant: "body2", children: ["\u2713 ", contactType === 'email' ? 'Email' : 'Mobile', " verified successfully"] }) }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, label: "Full Name", placeholder: "Enter your full name", value: fullName, onChange: (e) => {
                                        setFullName(e.target.value);
                                        setError('');
                                    }, disabled: isLoading, sx: { mb: 3 }, variant: "outlined", size: "medium" }), _jsx(TextField, { fullWidth: true, label: "Date of Birth", type: "date", value: dateOfBirth, onChange: (e) => {
                                        setDateOfBirth(e.target.value);
                                        setError('');
                                    }, disabled: isLoading, sx: { mb: 3 }, variant: "outlined", size: "medium", InputLabelProps: {
                                        shrink: true,
                                    } }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", disabled: isLoading, sx: {
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                    }, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(CircularProgress, { size: 20, sx: { mr: 1 } }), "Creating Account..."] })) : (_jsxs(_Fragment, { children: [_jsx(PersonAddIcon, { sx: { mr: 1 } }), "Complete Registration"] })) })] }), _jsx(Box, { sx: { mt: 3, textAlign: 'center' }, children: _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Your account will be created with ", contactType, " verified"] }) })] }) }) }) }));
}
