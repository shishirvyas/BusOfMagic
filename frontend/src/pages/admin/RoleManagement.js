import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, FormGroup, Alert, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Tooltip, } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Security as SecurityIcon, ExpandMore as ExpandMoreIcon, } from '@mui/icons-material';
import { roleApi, permissionApi } from '@/services/auth.service';
import { useAdminAuth } from '@/context/AdminAuthContext';
const RoleManagement = () => {
    const { isSuperAdmin } = useAdminAuth();
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Dialog states
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    // Form state
    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
    });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [rolesData, permissionsData] = await Promise.all([
                roleApi.getAll(),
                permissionApi.getGroupedByModule(),
            ]);
            setRoles(rolesData);
            setPermissions(permissionsData);
        }
        catch (err) {
            setError('Failed to load data');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenRoleDialog = (role) => {
        if (role) {
            setSelectedRole(role);
            setRoleForm({
                name: role.name,
                description: role.description || '',
            });
        }
        else {
            setSelectedRole(null);
            setRoleForm({ name: '', description: '' });
        }
        setOpenRoleDialog(true);
    };
    const handleCloseRoleDialog = () => {
        setOpenRoleDialog(false);
        setSelectedRole(null);
        setRoleForm({ name: '', description: '' });
    };
    const handleSaveRole = async () => {
        try {
            if (selectedRole) {
                await roleApi.update(selectedRole.id, roleForm);
            }
            else {
                await roleApi.create({ ...roleForm, permissions: [] });
            }
            await loadData();
            handleCloseRoleDialog();
        }
        catch (err) {
            setError(err.message || 'Failed to save role');
        }
    };
    const handleDeleteRole = async (role) => {
        if (role.name === 'SUPER_ADMIN') {
            setError('Cannot delete SUPER_ADMIN role');
            return;
        }
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            try {
                await roleApi.delete(role.id);
                await loadData();
            }
            catch (err) {
                setError(err.message || 'Failed to delete role');
            }
        }
    };
    const handleOpenPermissionDialog = (role) => {
        setSelectedRole(role);
        setSelectedPermissions([...role.permissions]);
        setOpenPermissionDialog(true);
    };
    const handleClosePermissionDialog = () => {
        setOpenPermissionDialog(false);
        setSelectedRole(null);
        setSelectedPermissions([]);
    };
    const handlePermissionToggle = (permissionCode) => {
        setSelectedPermissions(prev => prev.includes(permissionCode)
            ? prev.filter(p => p !== permissionCode)
            : [...prev, permissionCode]);
    };
    const handleSelectAllInModule = (module) => {
        const modulePermissions = permissions[module]?.map(p => p.code) || [];
        const allSelected = modulePermissions.every(p => selectedPermissions.includes(p));
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(p => !modulePermissions.includes(p)));
        }
        else {
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissions])]);
        }
    };
    const handleSavePermissions = async () => {
        if (!selectedRole)
            return;
        try {
            await roleApi.updatePermissions(selectedRole.id, selectedPermissions);
            await loadData();
            handleClosePermissionDialog();
        }
        catch (err) {
            setError(err.message || 'Failed to update permissions');
        }
    };
    if (!isSuperAdmin()) {
        return (_jsx(Box, { sx: { p: 3 }, children: _jsx(Alert, { severity: "error", children: "You don't have permission to access this page. Only Super Admin can manage roles." }) }));
    }
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 5 }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsxs(Typography, { variant: "h4", component: "h1", children: [_jsx(SecurityIcon, { sx: { mr: 1, verticalAlign: 'middle' } }), "Role Management"] }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenRoleDialog(), children: "Create Role" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'primary.main' }, children: [_jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Role Name" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Description" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Permissions" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, children: "Status" }), _jsx(TableCell, { sx: { color: 'white', fontWeight: 'bold' }, align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: roles.map((role) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Typography, { fontWeight: "medium", children: role.name }) }), _jsx(TableCell, { children: role.description }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: [role.permissions.slice(0, 3).map((perm) => (_jsx(Chip, { label: perm, size: "small", color: "primary", variant: "outlined" }, perm))), role.permissions.length > 3 && (_jsx(Tooltip, { title: role.permissions.slice(3).join(', '), children: _jsx(Chip, { label: `+${role.permissions.length - 3} more`, size: "small", color: "default" }) }))] }) }), _jsx(TableCell, { children: _jsx(Chip, { label: role.isActive ? 'Active' : 'Inactive', color: role.isActive ? 'success' : 'default', size: "small" }) }), _jsxs(TableCell, { align: "center", children: [_jsx(Tooltip, { title: "Edit Permissions", children: _jsx(IconButton, { color: "primary", onClick: () => handleOpenPermissionDialog(role), children: _jsx(SecurityIcon, {}) }) }), _jsx(Tooltip, { title: "Edit Role", children: _jsx(IconButton, { color: "info", onClick: () => handleOpenRoleDialog(role), disabled: role.name === 'SUPER_ADMIN', children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Delete Role", children: _jsx(IconButton, { color: "error", onClick: () => handleDeleteRole(role), disabled: role.name === 'SUPER_ADMIN', children: _jsx(DeleteIcon, {}) }) })] })] }, role.id))) })] }) }), _jsxs(Dialog, { open: openRoleDialog, onClose: handleCloseRoleDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: selectedRole ? 'Edit Role' : 'Create New Role' }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, margin: "dense", label: "Role Name", fullWidth: true, value: roleForm.name, onChange: (e) => setRoleForm({ ...roleForm, name: e.target.value }), disabled: selectedRole?.name === 'SUPER_ADMIN', sx: { mt: 2 } }), _jsx(TextField, { margin: "dense", label: "Description", fullWidth: true, multiline: true, rows: 3, value: roleForm.description, onChange: (e) => setRoleForm({ ...roleForm, description: e.target.value }) })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseRoleDialog, children: "Cancel" }), _jsx(Button, { onClick: handleSaveRole, variant: "contained", color: "primary", children: selectedRole ? 'Update' : 'Create' })] })] }), _jsxs(Dialog, { open: openPermissionDialog, onClose: handleClosePermissionDialog, maxWidth: "md", fullWidth: true, children: [_jsxs(DialogTitle, { children: ["Manage Permissions for: ", _jsx("strong", { children: selectedRole?.name })] }), _jsxs(DialogContent, { children: [_jsx(Typography, { variant: "body2", color: "textSecondary", sx: { mb: 2 }, children: "Select the permissions to assign to this role. Permissions are grouped by module." }), _jsx(Box, { sx: { mb: 2 }, children: _jsx(Chip, { label: `${selectedPermissions.length} permissions selected`, color: "primary", variant: "outlined" }) }), Object.entries(permissions).map(([module, modulePermissions]) => {
                                const allSelected = modulePermissions.every(p => selectedPermissions.includes(p.code));
                                const someSelected = modulePermissions.some(p => selectedPermissions.includes(p.code));
                                return (_jsxs(Accordion, { defaultExpanded: true, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', width: '100%' }, children: [_jsx(Checkbox, { checked: allSelected, indeterminate: someSelected && !allSelected, onChange: () => handleSelectAllInModule(module), onClick: (e) => e.stopPropagation() }), _jsx(Typography, { fontWeight: "medium", children: module }), _jsx(Chip, { label: `${modulePermissions.filter(p => selectedPermissions.includes(p.code)).length}/${modulePermissions.length}`, size: "small", sx: { ml: 2 } })] }) }), _jsx(AccordionDetails, { children: _jsx(FormGroup, { children: modulePermissions.map((permission) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: selectedPermissions.includes(permission.code), onChange: () => handlePermissionToggle(permission.code) }), label: _jsxs(Box, { children: [_jsxs(Typography, { variant: "body2", fontWeight: "medium", children: [permission.name, _jsx(Chip, { label: permission.code, size: "small", sx: { ml: 1, fontSize: '0.7rem' } })] }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: permission.description })] }), sx: { mb: 1 } }, permission.code))) }) })] }, module));
                            })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleClosePermissionDialog, children: "Cancel" }), _jsx(Button, { onClick: handleSavePermissions, variant: "contained", color: "primary", children: "Save Permissions" })] })] })] }));
};
export default RoleManagement;
