import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from '@mui/material';
export default function TrendChart() {
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Monthly Trend" }), _jsx(Box, { sx: {
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                }, children: _jsx(Typography, { color: "textSecondary", children: "Chart placeholder" }) })] }));
}
