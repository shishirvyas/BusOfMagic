import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, TablePagination, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Tooltip, } from '@mui/material';
import { Search as SearchIcon, School as SchoolIcon, CheckCircle as CompleteIcon, Refresh as RefreshIcon, } from '@mui/icons-material';
import { screeningApi } from '@services/screening.service';
import { useAdminAuth } from '@context/AdminAuthContext';
export default function Orientation() {
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
            const data = await screeningApi.getPendingOrientation();
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
    const handleCompleteOrientation = async () => {
        if (!selectedCandidate || !user)
            return;
        setProcessing(true);
        try {
            await screeningApi.completeOrientation({
                candidateWorkflowId: selectedCandidate.id,
                notes,
                completed: true
            }, user.userId);
            setDialogOpen(false);
            fetchCandidates();
        }
        catch (err) {
            setError(err.message || 'Failed to complete orientation');
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
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(SchoolIcon, { sx: { fontSize: 32, mr: 1, color: 'info.main' } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Orientation" }), _jsx(Chip, { label: candidates.length, color: "info", size: "small", sx: { ml: 2 } })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchCandidates, disabled: loading, children: "Refresh" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), _jsx(Paper, { sx: { p: 2, mb: 2 }, children: _jsx(TextField, { fullWidth: true, placeholder: "Search by name, email or phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                    }, size: "small" }) }), _jsx(TableContainer, { component: Paper, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(_Fragment, { children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Email" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Phone" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "City" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Screening Completed" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Screened By" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredCandidates
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((candidate) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsxs(Typography, { fontWeight: "medium", children: [candidate.firstName, " ", candidate.lastName] }) }), _jsx(TableCell, { children: candidate.email || '-' }), _jsx(TableCell, { children: candidate.phoneNumber }), _jsxs(TableCell, { children: [candidate.city, ", ", candidate.state] }), _jsx(TableCell, { children: formatDate(candidate.screeningCompletedAt) }), _jsx(TableCell, { children: candidate.screeningCompletedByName || '-' }), _jsx(TableCell, { align: "center", children: _jsx(Tooltip, { title: "Complete Orientation", children: _jsx(IconButton, { color: "success", onClick: () => handleOpenDialog(candidate), children: _jsx(CompleteIcon, {}) }) }) })] }, candidate.id))), filteredCandidates.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No candidates pending orientation" }) }) }))] })] }), _jsx(TablePagination, { component: "div", count: filteredCandidates.length, page: page, onPageChange: (_, newPage) => setPage(newPage), rowsPerPage: rowsPerPage, onRowsPerPageChange: (e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            } })] })) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsxs(DialogTitle, { children: ["Complete Orientation - ", selectedCandidate?.firstName, " ", selectedCandidate?.lastName] }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Alert, { severity: "info", sx: { mb: 2 }, children: "Completing orientation will move this candidate to the enrollment stage." }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Email:" }), " ", selectedCandidate?.email || 'N/A'] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Phone:" }), " ", selectedCandidate?.phoneNumber] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Location:" }), " ", selectedCandidate?.city, ", ", selectedCandidate?.state] }), selectedCandidate?.screeningNotes && (_jsxs(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: [_jsx("strong", { children: "Screening Notes:" }), " ", selectedCandidate.screeningNotes] })), _jsx(TextField, { fullWidth: true, multiline: true, rows: 3, label: "Orientation Notes", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Add any notes about the orientation...", sx: { mt: 3 } })] }) }), _jsxs(DialogActions, { sx: { p: 2, gap: 1 }, children: [_jsx(Button, { onClick: () => setDialogOpen(false), disabled: processing, children: "Cancel" }), _jsx(Button, { variant: "contained", color: "success", startIcon: _jsx(CompleteIcon, {}), onClick: handleCompleteOrientation, disabled: processing, children: processing ? _jsx(CircularProgress, { size: 20 }) : 'Complete Orientation' })] })] })] }));
}
