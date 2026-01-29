import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress, Tooltip, InputAdornment, } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility, VisibilityOff, ToggleOn, ToggleOff, Refresh as RefreshIcon, } from '@mui/icons-material';
import { adminApi, roleApi } from '@/services/auth.service';
import { useAdminAuth } from '@/context/AdminAuthContext';
const initialFormData = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: 0,
    stateId: undefined,
    cityId: undefined,
};
export default function AdminManagement() {
    const { user, isSuperAdmin } = useAdminAuth();
    // Data states
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const [adminsData, rolesData, statesRes, citiesRes] = await Promise.all([
                adminApi.getAll(),
                roleApi.getActive(),
                fetch('/api/locations/states').then(r => r.json()),
                fetch('/api/locations/cities').then(r => r.json()),
            ]);
            setAdmins(adminsData);
            setRoles(rolesData);
            setStates(statesRes);
            setCities(citiesRes);
        }
        catch (err) {
            setError('Failed to load data. Please try again.');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // Filter cities when state changes
    useEffect(() => {
        if (formData.stateId) {
            setFilteredCities(cities.filter(c => c.stateId === formData.stateId));
        }
        else {
            setFilteredCities([]);
        }
    }, [formData.stateId, cities]);
    const handleOpenDialog = (admin) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                username: admin.username,
                password: '', // Don't show existing password
                firstName: admin.firstName || '',
                lastName: admin.lastName || '',
                email: admin.email || '',
                phone: admin.phone || '',
                roleId: admin.roleId,
                stateId: admin.stateId,
                cityId: admin.cityId,
            });
        }
        else {
            setEditingAdmin(null);
            setFormData(initialFormData);
        }
        setFormError('');
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingAdmin(null);
        setFormData(initialFormData);
        setFormError('');
        setShowPassword(false);
    };
    const handleFormChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            // Reset city when state changes
            if (field === 'stateId') {
                updated.cityId = undefined;
            }
            return updated;
        });
    };
    const validateForm = () => {
        if (!formData.username.trim()) {
            setFormError('Username is required');
            return false;
        }
        if (!editingAdmin && !formData.password.trim()) {
            setFormError('Password is required for new admin');
            return false;
        }
        if (!formData.roleId) {
            setFormError('Role is required');
            return false;
        }
        // State/City admins need state/city assigned
        const selectedRole = roles.find(r => r.id === formData.roleId);
        if (selectedRole?.name === 'STATE_ADMIN' && !formData.stateId) {
            setFormError('State is required for State Admin');
            return false;
        }
        if (selectedRole?.name === 'CITY_ADMIN' && (!formData.stateId || !formData.cityId)) {
            setFormError('State and City are required for City Admin');
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        if (!validateForm())
            return;
        try {
            setSubmitting(true);
            setFormError('');
            if (editingAdmin) {
                await adminApi.update(editingAdmin.id, formData);
                setSuccess('Admin updated successfully');
            }
            else {
                await adminApi.create(formData);
                setSuccess('Admin created successfully');
            }
            handleCloseDialog();
            fetchData();
        }
        catch (err) {
            setFormError(err instanceof Error ? err.message : 'Operation failed');
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleToggleStatus = async (admin) => {
        try {
            await adminApi.toggleStatus(admin.id);
            setSuccess(`Admin ${admin.isActive ? 'deactivated' : 'activated'} successfully`);
            fetchData();
        }
        catch (err) {
            setError('Failed to toggle admin status');
        }
    };
    const handleDeleteClick = (admin) => {
        setAdminToDelete(admin);
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (!adminToDelete)
            return;
        try {
            await adminApi.delete(adminToDelete.id);
            setSuccess('Admin deleted successfully');
            setDeleteDialogOpen(false);
            setAdminToDelete(null);
            fetchData();
        }
        catch (err) {
            setError('Failed to delete admin');
        }
    };
    const getRoleColor = (roleName) => {
        switch (roleName) {
            case 'SUPER_ADMIN': return 'error';
            case 'STATE_ADMIN': return 'primary';
            case 'CITY_ADMIN': return 'secondary';
            default: return 'default';
        }
    };
    if (!isSuperAdmin()) {
        return (_jsx(Box, { sx: { p: 3 }, children: _jsx(Alert, { severity: "error", children: "Only Super Admins can access this page." }) }));
    }
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h4", component: "h1", children: "Admin Management" }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchData, disabled: loading, children: "Refresh" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenDialog(), children: "Add Admin" })] })] }), error && _jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(''), children: error }), success && _jsx(Alert, { severity: "success", sx: { mb: 2 }, onClose: () => setSuccess(''), children: success }), _jsx(Paper, { sx: { width: '100%', overflow: 'hidden' }, children: _jsx(TableContainer, { sx: { maxHeight: 600 }, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(Table, { stickyHeader: true, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Username" }), _jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Role" }), _jsx(TableCell, { children: "State" }), _jsx(TableCell, { children: "City" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Last Login" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsxs(TableBody, { children: [admins.map((admin) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: admin.username }), _jsxs(TableCell, { children: [admin.firstName, " ", admin.lastName] }), _jsx(TableCell, { children: _jsx(Chip, { label: admin.roleName, color: getRoleColor(admin.roleName), size: "small" }) }), _jsx(TableCell, { children: admin.stateName || '-' }), _jsx(TableCell, { children: admin.cityName || '-' }), _jsx(TableCell, { children: _jsx(Chip, { label: admin.isActive ? 'Active' : 'Inactive', color: admin.isActive ? 'success' : 'default', size: "small" }) }), _jsx(TableCell, { children: admin.lastLogin
                                                    ? new Date(admin.lastLogin).toLocaleString()
                                                    : 'Never' }), _jsxs(TableCell, { align: "center", children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenDialog(admin), disabled: admin.id === user?.userId, children: _jsx(EditIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: admin.isActive ? 'Deactivate' : 'Activate', children: _jsx(IconButton, { size: "small", onClick: () => handleToggleStatus(admin), disabled: admin.id === user?.userId, color: admin.isActive ? 'success' : 'default', children: admin.isActive ? _jsx(ToggleOn, { fontSize: "small" }) : _jsx(ToggleOff, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", onClick: () => handleDeleteClick(admin), disabled: admin.id === user?.userId, color: "error", children: _jsx(DeleteIcon, { fontSize: "small" }) }) })] })] }, admin.id))), admins.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", sx: { py: 4 }, children: "No admins found" }) }))] })] })) }) }), _jsxs(Dialog, { open: dialogOpen, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingAdmin ? 'Edit Admin' : 'Create New Admin' }), _jsxs(DialogContent, { children: [formError && (_jsx(Alert, { severity: "error", sx: { mb: 2, mt: 1 }, children: formError })), _jsx(TextField, { fullWidth: true, label: "Username", value: formData.username, onChange: (e) => handleFormChange('username', e.target.value), disabled: !!editingAdmin, margin: "normal", required: true }), _jsx(TextField, { fullWidth: true, label: editingAdmin ? 'New Password (leave empty to keep current)' : 'Password', type: showPassword ? 'text' : 'password', value: formData.password, onChange: (e) => handleFormChange('password', e.target.value), margin: "normal", required: !editingAdmin, InputProps: {
                                    endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) })),
                                } }), _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsx(TextField, { fullWidth: true, label: "First Name", value: formData.firstName, onChange: (e) => handleFormChange('firstName', e.target.value), margin: "normal" }), _jsx(TextField, { fullWidth: true, label: "Last Name", value: formData.lastName, onChange: (e) => handleFormChange('lastName', e.target.value), margin: "normal" })] }), _jsx(TextField, { fullWidth: true, label: "Email", type: "email", value: formData.email, onChange: (e) => handleFormChange('email', e.target.value), margin: "normal" }), _jsx(TextField, { fullWidth: true, label: "Phone", value: formData.phone, onChange: (e) => handleFormChange('phone', e.target.value), margin: "normal" }), _jsxs(FormControl, { fullWidth: true, margin: "normal", required: true, children: [_jsx(InputLabel, { children: "Role" }), _jsx(Select, { value: formData.roleId || '', label: "Role", onChange: (e) => handleFormChange('roleId', e.target.value), children: roles.map((role) => (_jsxs(MenuItem, { value: role.id, children: [role.name, " - ", role.description] }, role.id))) })] }), _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { children: "State" }), _jsxs(Select, { value: formData.stateId || '', label: "State", onChange: (e) => handleFormChange('stateId', e.target.value || undefined), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "None" }) }), states.map((state) => (_jsxs(MenuItem, { value: state.id, children: [state.stateName, " (", state.stateCode, ")"] }, state.id)))] })] }), _jsxs(FormControl, { fullWidth: true, margin: "normal", disabled: !formData.stateId, children: [_jsx(InputLabel, { children: "City" }), _jsxs(Select, { value: formData.cityId || '', label: "City", onChange: (e) => handleFormChange('cityId', e.target.value || undefined), children: [_jsx(MenuItem, { value: "", children: _jsx("em", { children: "None" }) }), filteredCities.map((city) => (_jsx(MenuItem, { value: city.id, children: city.cityName }, city.id)))] })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseDialog, disabled: submitting, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", disabled: submitting, children: submitting ? _jsx(CircularProgress, { size: 24 }) : editingAdmin ? 'Update' : 'Create' })] })] }), _jsxs(Dialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), children: [_jsx(DialogTitle, { children: "Confirm Delete" }), _jsx(DialogContent, { children: _jsxs(Typography, { children: ["Are you sure you want to delete admin \"", adminToDelete?.username, "\"? This action cannot be undone."] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDeleteDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleDeleteConfirm, color: "error", variant: "contained", children: "Delete" })] })] })] }));
}
