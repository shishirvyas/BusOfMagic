import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, TablePagination, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip, } from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon, HourglassEmpty as HourglassIcon, CheckCircle as ApproveIcon, PauseCircle as HoldIcon, Refresh as RefreshIcon, } from '@mui/icons-material';
import { screeningApi } from '@services/screening.service';
import { useAdminAuth } from '@context/AdminAuthContext';
export default function UnderScreening() {
    const { user } = useAdminAuth();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [error, setError] = useState(null);
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const fetchCandidates = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await screeningApi.getPendingScreening();
            setCandidates(data);
        }
        catch (err) {
            setError(err.message || 'Failed to load candidates');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCandidates();
    }, []);
    const handleOpenDialog = (candidate) => {
        setSelectedCandidate(candidate);
        setNotes('');
        setDialogOpen(true);
    };
    const handleCompleteScreening = async (approved) => {
        if (!selectedCandidate || !user)
            return;
        setProcessing(true);
        try {
            await screeningApi.completeScreening({
                candidateWorkflowId: selectedCandidate.id,
                notes,
                approved
            }, user.userId);
            setDialogOpen(false);
            fetchCandidates();
        }
        catch (err) {
            setError(err.message || 'Failed to update screening status');
        }
        finally {
            setProcessing(false);
        }
    };
    const filteredCandidates = candidates.filter(c => `${c.firstName} ${c.lastName} ${c.email} ${c.phoneNumber}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(HourglassIcon, { sx: { fontSize: 32, mr: 1, color: 'warning.main' } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Under Screening" }), _jsx(Chip, { label: candidates.length, color: "warning", size: "small", sx: { ml: 2 } })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchCandidates, disabled: loading, children: "Refresh" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), _jsx(Paper, { sx: { p: 2, mb: 2 }, children: _jsx(TextField, { fullWidth: true, placeholder: "Search by name, email or phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                    }, size: "small" }) }), _jsx(TableContainer, { component: Paper, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(_Fragment, { children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Email" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Phone" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "City" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Gender" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Registered On" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Dropout Score" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredCandidates
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((candidate) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsxs(Typography, { fontWeight: "medium", children: [candidate.firstName, " ", candidate.lastName] }) }), _jsx(TableCell, { children: candidate.email || '-' }), _jsx(TableCell, { children: candidate.phoneNumber }), _jsxs(TableCell, { children: [candidate.city, ", ", candidate.state] }), _jsx(TableCell, { children: _jsx(Chip, { label: candidate.gender, size: "small", variant: "outlined" }) }), _jsx(TableCell, { children: formatDate(candidate.createdAt) }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: candidate.engagementScore ? candidate.engagementScore.toFixed(1) : '-', color: candidate.engagementScore && candidate.engagementScore >= 60 ? 'success' : candidate.engagementScore && candidate.engagementScore >= 40 ? 'warning' : 'error', size: "small", variant: "filled" }) }), _jsx(TableCell, { align: "center", children: _jsx(Tooltip, { title: "View & Process", children: _jsx(IconButton, { color: "primary", onClick: () => handleOpenDialog(candidate), children: _jsx(ViewIcon, {}) }) }) })] }, candidate.id))), filteredCandidates.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 8, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No candidates pending screening" }) }) }))] })] }), _jsx(TablePagination, { component: "div", count: filteredCandidates.length, page: page, onPageChange: (_, newPage) => setPage(newPage), rowsPerPage: rowsPerPage, onRowsPerPageChange: (e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            } })] })) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsxs(DialogTitle, { children: ["Complete Screening - ", selectedCandidate?.firstName, " ", selectedCandidate?.lastName] }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { mt: 2 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Email:" }), " ", selectedCandidate?.email || 'N/A'] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Phone:" }), " ", selectedCandidate?.phoneNumber] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Location:" }), " ", selectedCandidate?.city, ", ", selectedCandidate?.state] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "DOB:" }), " ", selectedCandidate?.dateOfBirth] }), _jsx(TextField, { fullWidth: true, multiline: true, rows: 3, label: "Screening Notes", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Add any notes about this screening...", sx: { mt: 3 } })] }) }), _jsxs(DialogActions, { sx: { p: 2, gap: 1 }, children: [_jsx(Button, { onClick: () => setDialogOpen(false), disabled: processing, children: "Cancel" }), _jsx(Button, { variant: "outlined", color: "warning", startIcon: _jsx(HoldIcon, {}), onClick: () => handleCompleteScreening(false), disabled: processing, children: "Put On Hold" }), _jsx(Button, { variant: "contained", color: "success", startIcon: _jsx(ApproveIcon, {}), onClick: () => handleCompleteScreening(true), disabled: processing, children: processing ? _jsx(CircularProgress, { size: 20 }) : 'Approve & Move to Orientation' })] })] })] }));
}
