import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, } from '@mui/material';
const MOCK_CUSTOMERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', purchases: 12 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', purchases: 8 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', purchases: 5 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active', purchases: 15 },
];
export default function CustomerTable() {
    return (_jsxs(_Fragment, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Recent Customers" }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: '#f5f5f5' }, children: [_jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Email" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "right", children: "Purchases" })] }) }), _jsx(TableBody, { children: MOCK_CUSTOMERS.map((customer) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: customer.name }), _jsx(TableCell, { children: customer.email }), _jsx(TableCell, { children: _jsx(Chip, { label: customer.status, color: customer.status === 'Active' ? 'success' : 'default', size: "small" }) }), _jsx(TableCell, { align: "right", children: customer.purchases })] }, customer.id))) })] }) })] }));
}
