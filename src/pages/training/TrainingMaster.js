import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, TablePagination, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip, Switch, Grid, } from '@mui/material';
import { Search as SearchIcon, School as SchoolIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, } from '@mui/icons-material';
import { trainingMasterApi } from '@services/training.service';
export default function TrainingMaster() {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        skillCategory: '',
        durationDays: 0
    });
    const [processing, setProcessing] = useState(false);
    const fetchTrainings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await trainingMasterApi.getAll();
            setTrainings(data);
        }
        catch (err) {
            setError(err.message || 'Failed to load trainings');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTrainings();
    }, []);
    const handleOpenDialog = (training) => {
        if (training) {
            setEditingTraining(training);
            setFormData({
                name: training.name,
                description: training.description || '',
                skillCategory: training.skillCategory || '',
                durationDays: training.durationDays || 0
            });
        }
        else {
            setEditingTraining(null);
            setFormData({
                name: '',
                description: '',
                skillCategory: '',
                durationDays: 0
            });
        }
        setDialogOpen(true);
    };
    const handleSubmit = async () => {
        setProcessing(true);
        setError(null);
        try {
            if (editingTraining) {
                await trainingMasterApi.update(editingTraining.id, formData);
                setSuccess('Training updated successfully');
            }
            else {
                await trainingMasterApi.create(formData);
                setSuccess('Training created successfully');
            }
            setDialogOpen(false);
            fetchTrainings();
        }
        catch (err) {
            setError(err.message || 'Failed to save training');
        }
        finally {
            setProcessing(false);
        }
    };
    const handleToggleActive = async (training) => {
        try {
            await trainingMasterApi.toggleActive(training.id);
            fetchTrainings();
        }
        catch (err) {
            setError(err.message || 'Failed to toggle status');
        }
    };
    const handleDelete = async (training) => {
        if (!window.confirm(`Are you sure you want to delete "${training.name}"?`))
            return;
        try {
            await trainingMasterApi.delete(training.id);
            setSuccess('Training deleted successfully');
            fetchTrainings();
        }
        catch (err) {
            setError(err.message || 'Failed to delete training');
        }
    };
    const filteredTrainings = trainings.filter(t => `${t.name} ${t.skillCategory}`.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(SchoolIcon, { sx: { fontSize: 32, mr: 1, color: 'primary.main' } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Training Master" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchTrainings, disabled: loading, children: "Refresh" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenDialog(), children: "Add Training" })] })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), success && (_jsx(Alert, { severity: "success", sx: { mb: 2 }, onClose: () => setSuccess(null), children: success })), _jsx(Paper, { sx: { p: 2, mb: 2 }, children: _jsx(TextField, { fullWidth: true, placeholder: "Search trainings...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                    }, size: "small" }) }), _jsx(TableContainer, { component: Paper, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(_Fragment, { children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Skill Category" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Duration (Days)" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Batches" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredTrainings
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((training) => (_jsxs(TableRow, { hover: true, children: [_jsxs(TableCell, { children: [_jsx(Typography, { fontWeight: "medium", children: training.name }), training.description && (_jsx(Typography, { variant: "body2", color: "text.secondary", noWrap: true, sx: { maxWidth: 300 }, children: training.description }))] }), _jsx(TableCell, { children: _jsx(Chip, { label: training.skillCategory || 'General', size: "small", variant: "outlined" }) }), _jsx(TableCell, { children: training.durationDays || '-' }), _jsx(TableCell, { children: _jsxs(Typography, { variant: "body2", children: [training.activeBatches, " active / ", training.totalBatches, " total"] }) }), _jsxs(TableCell, { children: [_jsx(Switch, { checked: training.isActive, onChange: () => handleToggleActive(training), color: "success", size: "small" }), _jsx(Chip, { label: training.isActive ? 'Active' : 'Inactive', color: training.isActive ? 'success' : 'default', size: "small", sx: { ml: 1 } })] }), _jsxs(TableCell, { align: "center", children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { color: "primary", onClick: () => handleOpenDialog(training), size: "small", children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { color: "error", onClick: () => handleDelete(training), size: "small", disabled: training.totalBatches > 0, children: _jsx(DeleteIcon, {}) }) })] })] }, training.id))), filteredTrainings.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No trainings found. Click \"Add Training\" to create one." }) }) }))] })] }), _jsx(TablePagination, { component: "div", count: filteredTrainings.length, page: page, onPageChange: (_, newPage) => setPage(newPage), rowsPerPage: rowsPerPage, onRowsPerPageChange: (e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            } })] })) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingTraining ? 'Edit Training' : 'Add New Training' }), _jsx(DialogContent, { children: _jsx(Box, { sx: { mt: 2 }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Training Name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, multiline: true, rows: 3, label: "Description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Skill Category", value: formData.skillCategory, onChange: (e) => setFormData({ ...formData, skillCategory: e.target.value }), placeholder: "e.g., IT, Hospitality, Retail" }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Duration (Days)", value: formData.durationDays || '', onChange: (e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 }) }) })] }) }) }), _jsxs(DialogActions, { sx: { p: 2, gap: 1 }, children: [_jsx(Button, { onClick: () => setDialogOpen(false), disabled: processing, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: processing || !formData.name, children: processing ? _jsx(CircularProgress, { size: 20 }) : (editingTraining ? 'Update' : 'Create') })] })] })] }));
}
