import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Box, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useError } from '@context/ErrorContext';
export default function ErrorNotification() {
    const { errors, removeError } = useError();
    return (_jsx(Stack, { spacing: 2, sx: { position: 'fixed', top: 20, right: 20, zIndex: 9999 }, children: errors.map((error) => (_jsx(Alert, { severity: error.type === 'error' ? 'error' : error.type === 'warning' ? 'warning' : 'info', action: _jsx(IconButton, { size: "small", color: "inherit", onClick: () => removeError(error.id), children: _jsx(CloseIcon, { fontSize: "small" }) }), sx: {
                minWidth: 300,
                maxWidth: 500,
                boxShadow: 2,
                animation: 'slideIn 0.3s ease-in-out',
                '@keyframes slideIn': {
                    from: {
                        transform: 'translateX(600px)',
                        opacity: 0,
                    },
                    to: {
                        transform: 'translateX(0)',
                        opacity: 1,
                    },
                },
            }, children: _jsxs(Box, { children: [_jsx("strong", { children: error.title }), _jsx(Box, { sx: { fontSize: '0.875rem', mt: 0.5 }, children: error.message })] }) }, error.id))) }));
}
