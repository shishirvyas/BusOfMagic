import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert, CircularProgress, TextField, InputAdornment, Card, CardContent, Grid, Tabs, Tab, } from '@mui/material';
import { Key as KeyIcon, Search as SearchIcon, Security as SecurityIcon, } from '@mui/icons-material';
import { permissionApi, roleApi } from '@/services/auth.service';
import { useAdminAuth } from '@/context/AdminAuthContext';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `permission-tabpanel-${index}`, ...other, children: value === index && _jsx(Box, { sx: { py: 3 }, children: children }) }));
}
const PermissionManagement = () => {
    const { isSuperAdmin, hasPermission } = useAdminAuth();
    const [permissions, setPermissions] = useState({});
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState(0);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [permissionsData, rolesData] = await Promise.all([
                permissionApi.getGroupedByModule(),
                roleApi.getAll(),
            ]);
            setPermissions(permissionsData);
            setRoles(rolesData);
        }
        catch (err) {
            setError('Failed to load data');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleTabChange = (_event, newValue) => {
        setTabValue(newValue);
    };
    const filterPermissions = (perms) => {
        if (!searchTerm)
            return perms;
        const term = searchTerm.toLowerCase();
        return perms.filter(p => p.name.toLowerCase().includes(term) ||
            p.code.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term));
    };
    const getAllPermissions = () => {
        return Object.values(permissions).flat();
    };
    const filteredPermissions = searchTerm
        ? { filtered: filterPermissions(getAllPermissions()) }
        : permissions;
    if (!isSuperAdmin() && !hasPermission('PERMISSION_VIEW')) {
        return (_jsx(Box, { sx: { p: 3 }, children: _jsx(Alert, { severity: "error", children: "You don't have permission to access this page." }) }));
    }
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 5 }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h4", component: "h1", sx: { mb: 3 }, children: [_jsx(KeyIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Permission Management"] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), _jsxs(Tabs, { value: tabValue, onChange: handleTabChange, sx: { mb: 2 }, children: [_jsx(Tab, { label: "All Permissions" }), _jsx(Tab, { label: "Permission Matrix" })] }), _jsxs(TabPanel, { value: tabValue, index: 0, children: [_jsx(TextField, { fullWidth: true, placeholder: "Search permissions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), sx: { mb: 3 }, InputProps: {
                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                        } }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h3", color: "primary", children: getAllPermissions().length }), _jsx(Typography, { color: "textSecondary", children: "Total Permissions" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h3", color: "secondary", children: Object.keys(permissions).length }), _jsx(Typography, { color: "textSecondary", children: "Modules" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h3", color: "success.main", children: roles.length }), _jsx(Typography, { color: "textSecondary", children: "Roles" })] }) }) })] }), Object.entries(searchTerm ? filteredPermissions : permissions).map(([module, modulePermissions]) => (_jsxs(Paper, { sx: { mb: 2 }, children: [_jsx(Box, { sx: { p: 2, backgroundColor: 'primary.main', color: 'white' }, children: _jsxs(Typography, { variant: "h6", children: [module, _jsx(Chip, { label: modulePermissions.length, size: "small", sx: { ml: 2, backgroundColor: 'white', color: 'primary.main' } })] }) }), _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("strong", { children: "Code" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Description" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Assigned To Roles" }) })] }) }), _jsx(TableBody, { children: modulePermissions.map((permission) => {
                                                const assignedRoles = roles.filter(r => r.permissions.includes(permission.code));
                                                return (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Chip, { label: permission.code, size: "small", color: "primary", variant: "outlined" }) }), _jsx(TableCell, { children: permission.name }), _jsx(TableCell, { children: _jsx(Typography, { variant: "body2", color: "textSecondary", children: permission.description }) }), _jsx(TableCell, { children: _jsx(Chip, { label: permission.isActive ? 'Active' : 'Inactive', color: permission.isActive ? 'success' : 'default', size: "small" }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: [assignedRoles.map(role => (_jsx(Chip, { label: role.name, size: "small", icon: _jsx(SecurityIcon, {}) }, role.id))), assignedRoles.length === 0 && (_jsx(Typography, { variant: "caption", color: "textSecondary", children: "Not assigned" }))] }) })] }, permission.id));
                                            }) })] }) })] }, module)))] }), _jsxs(TabPanel, { value: tabValue, index: 1, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Role-Permission Matrix" }), _jsx(Paper, { sx: { overflow: 'auto' }, children: _jsx(TableContainer, { children: _jsxs(Table, { size: "small", stickyHeader: true, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { sx: {
                                                        backgroundColor: 'primary.main',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        minWidth: 200,
                                                    }, children: "Permission" }), roles.map(role => (_jsx(TableCell, { align: "center", sx: {
                                                        backgroundColor: 'primary.main',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        minWidth: 120,
                                                    }, children: role.name }, role.id)))] }) }), _jsx(TableBody, { children: Object.entries(permissions).map(([module, modulePermissions]) => (_jsxs(React.Fragment, { children: [_jsx(TableRow, { children: _jsx(TableCell, { colSpan: roles.length + 1, sx: {
                                                            backgroundColor: 'grey.200',
                                                            fontWeight: 'bold',
                                                        }, children: module }) }), modulePermissions.map(permission => (_jsxs(TableRow, { hover: true, children: [_jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", children: permission.name }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: permission.code })] }), roles.map(role => (_jsx(TableCell, { align: "center", children: role.permissions.includes(permission.code) ? (_jsx(Chip, { label: "\u2713", color: "success", size: "small", sx: { minWidth: 32 } })) : (_jsx(Typography, { color: "textSecondary", children: "\u2014" })) }, role.id)))] }, permission.id)))] }, module))) })] }) }) })] })] }));
};
export default PermissionManagement;
