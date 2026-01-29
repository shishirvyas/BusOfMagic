import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
export default function StatCard({ title, value, change }) {
    const isPositive = change.startsWith('+');
    return (_jsx(Card, { sx: { height: '100%', position: 'relative', overflow: 'hidden' }, children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: title }), _jsx(Typography, { variant: "h5", sx: { my: 2 }, children: value }), _jsxs(Box, { sx: {
                        display: 'flex',
                        alignItems: 'center',
                        color: isPositive ? 'success.main' : 'error.main',
                    }, children: [_jsx(TrendingUpIcon, { fontSize: "small" }), _jsx(Typography, { variant: "body2", sx: { ml: 1 }, children: change })] })] }) }));
}
