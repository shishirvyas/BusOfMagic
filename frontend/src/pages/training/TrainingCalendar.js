import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Button, LinearProgress, Avatar, } from '@mui/material';
import { CalendarMonth as CalendarIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Refresh as RefreshIcon, People as PeopleIcon, EventAvailable as EventAvailableIcon, School as SchoolIcon, LocationOn as LocationIcon, Person as PersonIcon, } from '@mui/icons-material';
export default function TrainingCalendar() {
    const [calendarData, setCalendarData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBatch, setExpandedBatch] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('');
    const fetchCalendarData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filterStatus === 'active')
                params.append('activeOnly', 'true');
            const [calendarRes, summaryRes] = await Promise.all([
                fetch(`/api/training-calendar?${params}`),
                fetch('/api/training-calendar/summary')
            ]);
            if (!calendarRes.ok || !summaryRes.ok) {
                throw new Error('Failed to fetch calendar data');
            }
            const calendarJson = await calendarRes.json();
            const summaryJson = await summaryRes.json();
            setCalendarData(calendarJson);
            setSummary(summaryJson);
        }
        catch (err) {
            setError(err.message || 'Failed to load training calendar');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCalendarData();
    }, [filterStatus]);
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    const getBatchStatus = (batch) => {
        const today = new Date();
        const startDate = new Date(batch.startDate);
        const endDate = new Date(batch.endDate);
        if (today < startDate)
            return { label: 'Upcoming', color: 'info' };
        if (today > endDate)
            return { label: 'Completed', color: 'default' };
        return { label: 'Ongoing', color: 'success' };
    };
    const getOccupancyColor = (enrolled, capacity) => {
        const percentage = (enrolled / capacity) * 100;
        if (percentage >= 90)
            return 'error';
        if (percentage >= 70)
            return 'warning';
        return 'success';
    };
    const handleExpandClick = (batchId) => {
        setExpandedBatch(expandedBatch === batchId ? null : batchId);
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(CalendarIcon, { sx: { fontSize: 32, mr: 1, color: 'primary.main' } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Training Calendar" })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: fetchCalendarData, disabled: loading, children: "Refresh" })] }), error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, onClose: () => setError(null), children: error })), summary && (_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'primary.light', color: 'primary.contrastText' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", fontWeight: "bold", children: summary.totalActiveBatches }), _jsx(Typography, { variant: "body2", children: "Active Batches" })] }), _jsx(SchoolIcon, { sx: { fontSize: 40, opacity: 0.7 } })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'info.light', color: 'info.contrastText' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", fontWeight: "bold", children: summary.upcomingBatches }), _jsx(Typography, { variant: "body2", children: "Upcoming" })] }), _jsx(EventAvailableIcon, { sx: { fontSize: 40, opacity: 0.7 } })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'success.light', color: 'success.contrastText' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", fontWeight: "bold", children: summary.totalEnrolled }), _jsx(Typography, { variant: "body2", children: "Total Enrolled" })] }), _jsx(PeopleIcon, { sx: { fontSize: 40, opacity: 0.7 } })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'warning.light', color: 'warning.contrastText' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", fontWeight: "bold", children: summary.totalAvailableSlots }), _jsx(Typography, { variant: "body2", children: "Slots Available" })] }), _jsx(CalendarIcon, { sx: { fontSize: 40, opacity: 0.7 } })] }) }) }) })] })), _jsx(Paper, { sx: { p: 2, mb: 2 }, children: _jsxs(Grid, { container: true, spacing: 2, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsxs(FormControl, { fullWidth: true, size: "small", children: [_jsx(InputLabel, { children: "Status Filter" }), _jsxs(Select, { value: filterStatus, label: "Status Filter", onChange: (e) => setFilterStatus(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Batches" }), _jsx(MenuItem, { value: "active", children: "Active Only" })] })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 8, children: _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Showing ", calendarData.length, " training batch(es)", summary && ` • Occupancy: ${summary.occupancyRate.toFixed(1)}%`] }) })] }) }), _jsx(TableContainer, { component: Paper, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', p: 4 }, children: _jsx(CircularProgress, {}) })) : (_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { width: 50 }), _jsx(TableCell, { children: _jsx("strong", { children: "Training / Batch" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Schedule" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Location" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Trainer" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Slots" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Status" }) })] }) }), _jsxs(TableBody, { children: [calendarData.map((batch) => {
                                    const status = getBatchStatus(batch);
                                    const isExpanded = expandedBatch === batch.batchId;
                                    return (_jsxs(_Fragment, { children: [_jsxs(TableRow, { hover: true, sx: {
                                                    '& > *': { borderBottom: isExpanded ? 'unset' : undefined },
                                                    cursor: 'pointer',
                                                    bgcolor: isExpanded ? 'action.selected' : 'inherit'
                                                }, onClick: () => handleExpandClick(batch.batchId), children: [_jsx(TableCell, { children: _jsx(IconButton, { size: "small", children: isExpanded ? _jsx(ExpandLessIcon, {}) : _jsx(ExpandMoreIcon, {}) }) }), _jsxs(TableCell, { children: [_jsx(Typography, { fontWeight: "bold", children: batch.trainingName }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: [batch.batchCode, " \u2022 ", batch.skillCategory] })] }), _jsxs(TableCell, { children: [_jsxs(Typography, { variant: "body2", children: [formatDate(batch.startDate), " - ", formatDate(batch.endDate)] }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [batch.durationDays, " days"] })] }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(LocationIcon, { sx: { fontSize: 16, mr: 0.5, color: 'text.secondary' } }), batch.location || '-'] }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(PersonIcon, { sx: { fontSize: 16, mr: 0.5, color: 'text.secondary' } }), batch.trainerName || '-'] }) }), _jsx(TableCell, { align: "center", children: _jsxs(Box, { children: [_jsx(Chip, { label: `${batch.currentEnrolled} / ${batch.maxCapacity}`, color: getOccupancyColor(batch.currentEnrolled, batch.maxCapacity), size: "small", variant: "filled" }), _jsx(LinearProgress, { variant: "determinate", value: (batch.currentEnrolled / batch.maxCapacity) * 100, color: getOccupancyColor(batch.currentEnrolled, batch.maxCapacity), sx: { mt: 0.5, height: 4, borderRadius: 2 } }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [batch.availableSlots, " remaining"] })] }) }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: status.label, color: status.color, size: "small" }) })] }, batch.batchId), _jsx(TableRow, { children: _jsx(TableCell, { style: { paddingBottom: 0, paddingTop: 0 }, colSpan: 7, children: _jsx(Collapse, { in: isExpanded, timeout: "auto", unmountOnExit: true, children: _jsxs(Box, { sx: { margin: 2 }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: ["Enrolled Candidates (", batch.enrolledCandidates.length, ")"] }), batch.enrolledCandidates.length > 0 ? (_jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("strong", { children: "Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Email" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Phone" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Location" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Enrolled On" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Enrolled By" }) })] }) }), _jsx(TableBody, { children: batch.enrolledCandidates.map((candidate) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsxs(Avatar, { sx: { width: 28, height: 28, mr: 1, fontSize: 12 }, children: [candidate.firstName?.[0], candidate.lastName?.[0]] }), candidate.firstName, " ", candidate.lastName] }) }), _jsx(TableCell, { children: candidate.email || '-' }), _jsx(TableCell, { children: candidate.phoneNumber }), _jsxs(TableCell, { children: [candidate.city, ", ", candidate.state] }), _jsx(TableCell, { children: candidate.enrolledAt ? formatDate(candidate.enrolledAt) : '-' }), _jsx(TableCell, { children: candidate.enrolledByName || '-' })] }, candidate.candidateId))) })] })) : (_jsx(Typography, { color: "text.secondary", sx: { py: 2 }, children: "No candidates enrolled yet" }))] }) }) }) })] }));
                                }), calendarData.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "text.secondary", children: "No training batches found" }) }) }))] })] })) })] }));
}
