import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Container, Alert, CircularProgress, LinearProgress, } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '@context/AuthContext';
const OTP_RESEND_TIME = 30; // seconds
export default function OTPVerification({ contactType, contact, onVerify, onEdit, isLoading = false, }) {
    const { setCandidateData } = useAuth();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(OTP_RESEND_TIME);
    const [canResend, setCanResend] = useState(false);
    // Timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
        else {
            setCanResend(true);
        }
    }, [resendTimer]);
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!otp.trim()) {
            setError('Please enter the OTP');
            return;
        }
        if (otp.length < 4) {
            setError('OTP must be at least 4 digits');
            return;
        }
        // Save registration method and contact to context
        setCandidateData({
            registrationMethod: contactType === 'email' ? 'email' : 'phone',
            registrationContact: contact,
        });
        // Let backend validate the OTP
        onVerify(otp);
    };
    const handleResend = () => {
        setOtp('');
        setError('');
        setCanResend(false);
        setResendTimer(OTP_RESEND_TIME);
    };
    const maskedContact = contactType === 'email'
        ? contact.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        : `****${contact.slice(-4)}`;
    return (_jsx(Container, { maxWidth: "sm", children: _jsx(Box, { sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                py: 4,
            }, children: _jsx(Card, { sx: {
                    width: '100%',
                    boxShadow: 3,
                }, children: _jsxs(CardContent, { sx: { p: { xs: 2, sm: 3 } }, children: [_jsx(Box, { sx: { textAlign: 'center', mb: 3 }, children: _jsx(CheckCircleIcon, { sx: {
                                    fontSize: 60,
                                    color: 'success.main',
                                    mb: 2,
                                } }) }), _jsxs(Box, { sx: { mb: 3, textAlign: 'center' }, children: [_jsxs(Typography, { variant: "h5", component: "h1", sx: { fontWeight: 'bold', mb: 1 }, children: ["Verify Your ", contactType === 'email' ? 'Email' : 'Phone'] }), _jsx(Typography, { variant: "body2", color: "textSecondary", sx: { mb: 2 }, children: "We've sent an OTP to:" }), _jsx(Typography, { variant: "body1", sx: {
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        wordBreak: 'break-all',
                                    }, children: maskedContact })] }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["OTP expires in: ", resendTimer, "s"] }), _jsx(LinearProgress, { variant: "determinate", value: (resendTimer / OTP_RESEND_TIME) * 100, sx: { mt: 1 } })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, label: "Enter OTP", placeholder: "0000", value: otp, onChange: (e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        setOtp(val);
                                        setError('');
                                    }, inputProps: {
                                        maxLength: 4,
                                        style: {
                                            fontSize: '1.5rem',
                                            letterSpacing: '0.5rem',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                        },
                                    }, disabled: isLoading, sx: {
                                        mb: 2,
                                        '& input': {
                                            textAlign: 'center',
                                        },
                                    }, type: "text", inputMode: "numeric", variant: "outlined" }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", size: "large", disabled: isLoading || otp.length !== 4, sx: {
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                    }, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(CircularProgress, { size: 20, sx: { mr: 1 } }), "Verifying..."] })) : (_jsxs(_Fragment, { children: [_jsx(LockIcon, { sx: { mr: 1 } }), "Verify OTP"] })) })] }), _jsx(Box, { sx: { mt: 3, textAlign: 'center' }, children: canResend ? (_jsx(Button, { onClick: handleResend, variant: "text", size: "small", sx: {
                                    textTransform: 'none',
                                    color: 'primary.main',
                                }, children: "Resend OTP" })) : (_jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["Resend OTP in ", resendTimer, "s"] })) }), _jsx(Box, { sx: { mt: 2, textAlign: 'center' }, children: _jsxs(Button, { onClick: onEdit, variant: "text", size: "small", sx: {
                                    textTransform: 'none',
                                }, children: ["Use different ", contactType] }) })] }) }) }) }));
}
