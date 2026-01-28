import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, TablePagination, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip, Switch, Grid, FormControl, InputLabel, Select, MenuItem, LinearProgress, } from '@mui/material';
import { Search as SearchIcon, EventNote as BatchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, } from '@mui/icons-material';
import { trainingBatchApi, trainingMasterApi } from '@services/training.service';
export default function TrainingBatches() {
    const [batches, setBatches] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [formData, setFormData] = useState({
        trainingId: 0,
        batchCode: '',
        startDate: '',
        endDate: '',
        maxCapacity: 30,
        location: '',
        trainerName: ''
    });
    const [processing, setProcessing] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [batchesData, trainingsData] = await Promise.all([
                trainingBatchApi.getAll(),
                trainingMasterApi.getActive()
            ]);
            setBatches(batchesData);
            setTrainings(trainingsData);
        }
        catch (err) {
            setError(err.message || 'Failed to load data');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleOpenDialog = (batch) => {
        if (batch) {
            setEditingBatch(batch);
            setFormData({
                trainingId: batch.trainingId,
                batchCode: batch.batchCode,
                startDate: batch.startDate,
                endDate: batch.endDate,
                maxCapacity: batch.maxCapacity,
                location: batch.location || '',
                trainerName: batch.trainerName || ''
            });
        }
        else {
            setEditingBatch(null);
            setFormData({
                trainingId: trainings[0]?.id || 0,
                batchCode: '',
                startDate: '',
                endDate: '',
                maxCapacity: 30,
                location: '',
                trainerName: ''
            });
        }
        setDialogOpen(true);
    };
    const handleSubmit = async () => {
        setProcessing(true);
        setError(null);
        try {
            if (editingBatch) {
                await trainingBatchApi.update(editingBatch.id, formData);
                setSuccess('Batch updated successfully');
            }
            else {
                await trainingBatchApi.create(formData);
                setSuccess('Batch created successfully');
            }
            setDialogOpen(false);
            fetchData();
        }
        catch (err) {
            setError(err.message || 'Failed to save batch');
        }
        finally {
            setProcessing(false);
        }
    };
    const handleToggleActive = async (batch) => {
        try {
            await trainingBatchApi.toggleActive(batch.id);
            fetchData();
        }
        catch (err) {
            setError(err.message || 'Failed to toggle status');
        }
    };
    const handleDelete = async (batch) => {
        if (!window.confirm(`Are you sure you want to delete batch "${batch.batchCode}"?`))
            return;
        try {
            await trainingBatchApi.delete(batch.id);
            setSuccess('Batch deleted successfully');
            fetchData();
        }
        catch (err) {
            setError(err.message || 'Failed to delete batch');
        }
    };
    const filteredBatches = batches.filter(b => `${b.batchCode} ${b.trainingName} ${b.location}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    const getCapacityColor = (enrolled, max) => {
        const percentage = (enrolled / max) * 100;
        if (percentage >= 90)
            return 'error';
        if (percentage >= 70)
            return 'warning';
        return 'success';
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(BatchIcon, { sx: { fontSize: 32, mr: 1, color: 'primary.main' } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Training Batches" })] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchData, disabled: loading, children: "Refresh" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenDialog(), disabled: trainings.length === 0, children: "Add Batch" })] })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), success && (_jsx(Alert, { severity: "success", sx: { mb: 2 }, onClose: () => setSuccess(null), children: success })), trainings.length === 0 && !loading && (_jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: "No active trainings found. Please create trainings in Training Master first." })), _jsx(Paper, { sx: { p: 2, mb: 2 }, children: _jsx(TextField, { fullWidth: true, placeholder: "Search batches...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                    }, size: "small" }) }), _jsx(TableContainer, { component: Paper, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(_Fragment, { children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Batch Code" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Training" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Duration" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Location" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Trainer" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Capacity" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredBatches
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((batch) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Typography, { fontWeight: "medium", children: batch.batchCode }) }), _jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", children: batch.trainingName }), _jsx(Chip, { label: batch.skillCategory || 'General', size: "small", variant: "outlined" })] }), _jsxs(TableCell, { children: [_jsx(Typography, { variant: "body2", children: formatDate(batch.startDate) }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["to ", formatDate(batch.endDate)] })] }), _jsx(TableCell, { children: batch.location || '-' }), _jsx(TableCell, { children: batch.trainerName || '-' }), _jsx(TableCell, { children: _jsxs(Box, { sx: { width: 100 }, children: [_jsxs(Typography, { variant: "body2", children: [batch.currentEnrolled, " / ", batch.maxCapacity] }), _jsx(LinearProgress, { variant: "determinate", value: (batch.currentEnrolled / batch.maxCapacity) * 100, color: getCapacityColor(batch.currentEnrolled, batch.maxCapacity), sx: { height: 6, borderRadius: 3 } })] }) }), _jsxs(TableCell, { children: [_jsx(Switch, { checked: batch.isActive, onChange: () => handleToggleActive(batch), color: "success", size: "small" }), _jsx(Chip, { label: batch.isActive ? 'Active' : 'Inactive', color: batch.isActive ? 'success' : 'default', size: "small", sx: { ml: 1 } })] }), _jsxs(TableCell, { align: "center", children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { color: "primary", onClick: () => handleOpenDialog(batch), size: "small", children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { color: "error", onClick: () => handleDelete(batch), size: "small", disabled: batch.currentEnrolled > 0, children: _jsx(DeleteIcon, {}) }) })] })] }, batch.id))), filteredBatches.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No batches found. Click \"Add Batch\" to create one." }) }) }))] })] }), _jsx(TablePagination, { component: "div", count: filteredBatches.length, page: page, onPageChange: (_, newPage) => setPage(newPage), rowsPerPage: rowsPerPage, onRowsPerPageChange: (e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            } })] })) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingBatch ? 'Edit Batch' : 'Add New Batch' }), _jsx(DialogContent, { children: _jsx(Box, { sx: { mt: 2 }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, required: true, children: [_jsx(InputLabel, { children: "Training Program" }), _jsx(Select, { value: formData.trainingId || '', label: "Training Program", onChange: (e) => setFormData({ ...formData, trainingId: e.target.value }), children: trainings.map((training) => (_jsxs(MenuItem, { value: training.id, children: [training.name, " (", training.skillCategory || 'General', ")"] }, training.id))) })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Batch Code", value: formData.batchCode, onChange: (e) => setFormData({ ...formData, batchCode: e.target.value }), placeholder: "e.g., BATCH-2026-001", required: true }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, type: "date", label: "Start Date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), InputLabelProps: { shrink: true }, required: true }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, type: "date", label: "End Date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), InputLabelProps: { shrink: true }, required: true }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Max Capacity", value: formData.maxCapacity, onChange: (e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 30 }) }) }), _jsx(Grid, { item: true, xs: 6, children: _jsx(TextField, { fullWidth: true, label: "Trainer Name", value: formData.trainerName, onChange: (e) => setFormData({ ...formData, trainerName: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Location", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), placeholder: "e.g., Mumbai Training Center" }) })] }) }) }), _jsxs(DialogActions, { sx: { p: 2, gap: 1 }, children: [_jsx(Button, { onClick: () => setDialogOpen(false), disabled: processing, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: processing || !formData.batchCode || !formData.trainingId || !formData.startDate || !formData.endDate, children: processing ? _jsx(CircularProgress, { size: 20 }) : (editingBatch ? 'Update' : 'Create') })] })] })] }));
}
