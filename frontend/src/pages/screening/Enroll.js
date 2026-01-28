import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, TablePagination, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Grid, } from '@mui/material';
import { Search as SearchIcon, HowToReg as EnrollIcon, Refresh as RefreshIcon, Event as EventIcon, } from '@mui/icons-material';
import { screeningApi } from '@services/screening.service';
import { trainingBatchApi } from '@services/training.service';
import { useAdminAuth } from '@context/AdminAuthContext';
export default function Enroll() {
    const { user } = useAdminAuth();
    const [candidates, setCandidates] = useState([]);
    const [availableBatches, setAvailableBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [error, setError] = useState(null);
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [candidatesData, batchesData] = await Promise.all([
                screeningApi.getPendingEnrollment(),
                trainingBatchApi.getAvailable()
            ]);
            setCandidates(candidatesData);
            setAvailableBatches(batchesData);
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
    const handleOpenDialog = (candidate) => {
        setSelectedCandidate(candidate);
        setSelectedBatchId('');
        setNotes('');
        setDialogOpen(true);
    };
    const handleEnroll = async () => {
        if (!selectedCandidate || !user || !selectedBatchId)
            return;
        setProcessing(true);
        try {
            await screeningApi.enrollCandidate({
                candidateWorkflowId: selectedCandidate.id,
                trainingBatchId: selectedBatchId,
                notes
            }, user.userId);
            setDialogOpen(false);
            fetchData();
        }
        catch (err) {
            setError(err.message || 'Failed to enroll candidate');
        }
        finally {
            setProcessing(false);
        }
    };
    const filteredCandidates = candidates.filter(c => `${c.firstName} ${c.lastName} ${c.email} ${c.phoneNumber}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const formatDate = (dateStr) => {
        if (!dateStr)
            return '-';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    const selectedBatch = availableBatches.find(b => b.id === selectedBatchId);
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(EnrollIcon, { sx: { fontSize: 32, mr: 1, color: 'success.main' } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Enrollment" }), _jsx(Chip, { label: candidates.length, color: "success", size: "small", sx: { ml: 2 } })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchData, disabled: loading, children: "Refresh" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), availableBatches.length === 0 && !loading && (_jsx(Alert, { severity: "warning", sx: { mb: 2 }, children: "No training batches available. Please create training batches first." })), _jsx(Paper, { sx: { p: 2, mb: 2 }, children: _jsx(TextField, { fullWidth: true, placeholder: "Search by name, email or phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                    }, size: "small" }) }), _jsx(TableContainer, { component: Paper, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(_Fragment, { children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Email" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Phone" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "City" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Orientation Completed" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredCandidates
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((candidate) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsxs(Typography, { fontWeight: "medium", children: [candidate.firstName, " ", candidate.lastName] }) }), _jsx(TableCell, { children: candidate.email || '-' }), _jsx(TableCell, { children: candidate.phoneNumber }), _jsxs(TableCell, { children: [candidate.city, ", ", candidate.state] }), _jsx(TableCell, { children: formatDate(candidate.orientationCompletedAt) }), _jsx(TableCell, { align: "center", children: _jsx(Tooltip, { title: "Enroll in Training", children: _jsx(IconButton, { color: "success", onClick: () => handleOpenDialog(candidate), disabled: availableBatches.length === 0, children: _jsx(EnrollIcon, {}) }) }) })] }, candidate.id))), filteredCandidates.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No candidates pending enrollment" }) }) }))] })] }), _jsx(TablePagination, { component: "div", count: filteredCandidates.length, page: page, onPageChange: (_, newPage) => setPage(newPage), rowsPerPage: rowsPerPage, onRowsPerPageChange: (e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            } })] })) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "md", fullWidth: true, children: [_jsxs(DialogTitle, { children: ["Enroll Candidate - ", selectedCandidate?.firstName, " ", selectedCandidate?.lastName] }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Grid, { container: true, spacing: 2, children: _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Email:" }), " ", selectedCandidate?.email || 'N/A'] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Phone:" }), " ", selectedCandidate?.phoneNumber] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Location:" }), " ", selectedCandidate?.city, ", ", selectedCandidate?.state] })] }) }), _jsxs(FormControl, { fullWidth: true, sx: { mt: 3 }, children: [_jsx(InputLabel, { children: "Select Training Batch" }), _jsx(Select, { value: selectedBatchId, label: "Select Training Batch", onChange: (e) => setSelectedBatchId(e.target.value), children: availableBatches.map((batch) => (_jsxs(MenuItem, { value: batch.id, children: [batch.trainingName, " - ", batch.batchCode, " (", batch.availableSlots, " slots available)"] }, batch.id))) })] }), selectedBatch && (_jsx(Card, { variant: "outlined", sx: { mt: 2 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: selectedBatch.trainingName }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsx(EventIcon, { sx: { fontSize: 16, mr: 0.5, verticalAlign: 'middle' } }), _jsx("strong", { children: "Duration:" }), " ", formatDate(selectedBatch.startDate), " - ", formatDate(selectedBatch.endDate)] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsx("strong", { children: "Location:" }), " ", selectedBatch.location || 'TBD'] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsx("strong", { children: "Trainer:" }), " ", selectedBatch.trainerName || 'TBD'] }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [_jsx("strong", { children: "Skill:" }), " ", selectedBatch.skillCategory || 'General'] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Chip, { label: `${selectedBatch.availableSlots} of ${selectedBatch.maxCapacity} slots available`, color: "success", size: "small" }) })] })] }) })), _jsx(TextField, { fullWidth: true, multiline: true, rows: 2, label: "Enrollment Notes", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Add any notes about this enrollment...", sx: { mt: 3 } })] }) }), _jsxs(DialogActions, { sx: { p: 2, gap: 1 }, children: [_jsx(Button, { onClick: () => setDialogOpen(false), disabled: processing, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "success", startIcon: _jsx(EnrollIcon, {}), onClick: handleEnroll, disabled: processing || !selectedBatchId, children: processing ? _jsx(CircularProgress, { size: 20 }) : 'Enroll Candidate' })] })] })] }));
}
