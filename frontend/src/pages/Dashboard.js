import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, } from '@mui/material';
import { People as PeopleIcon, CheckCircle as CheckCircleIcon, Pending as PendingIcon, School as SchoolIcon, TrendingUp as TrendingUpIcon, HourglassEmpty as HourglassIcon, Cancel as CancelIcon, } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, } from 'recharts';
const COLORS = {
    completed: '#4caf50',
    incomplete: '#ff9800',
    pendingScreening: '#2196f3',
    pendingOrientation: '#9c27b0',
    pendingEnroll: '#00bcd4',
    enrolled: '#4caf50',
    dropped: '#f44336',
};
const PIE_COLORS = ['#4caf50', '#ff9800'];
const WORKFLOW_COLORS = ['#2196f3', '#9c27b0', '#00bcd4', '#4caf50', '#f44336'];
export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/dashboard/stats?year=${selectedYear}`);
            if (!response.ok)
                throw new Error('Failed to fetch dashboard data');
            const data = await response.json();
            setDashboardData(data);
        }
        catch (err) {
            setError(err.message || 'Failed to load dashboard');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, [selectedYear]);
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    // Prepare pie chart data for onboarding status
    const onboardingPieData = dashboardData ? [
        { name: 'Completed', value: dashboardData.completedOnboarding },
        { name: 'Incomplete', value: dashboardData.incompleteOnboarding },
    ] : [];
    // Prepare pie chart data for workflow status
    const workflowPieData = dashboardData ? [
        { name: 'Evaluation Pending', value: dashboardData.pendingScreening },
        { name: 'Pending Orientation', value: dashboardData.pendingOrientation },
        { name: 'Pending Enroll', value: dashboardData.pendingEnroll },
        { name: 'Enrolled', value: dashboardData.enrolled },
        { name: 'Dropped', value: dashboardData.dropped },
    ].filter(item => item.value > 0) : [];
    if (loading) {
        return (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }, children: _jsx(CircularProgress, { size: 60 }) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }));
    }
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h4", fontWeight: "bold", children: "Dashboard" }), _jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { children: "Year" }), _jsx(Select, { value: selectedYear, label: "Year", onChange: (e) => setSelectedYear(e.target.value), children: yearOptions.map((year) => (_jsx(MenuItem, { value: year, children: year }, year))) })] })] }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'primary.main', color: 'white' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", fontWeight: "bold", children: dashboardData?.totalCandidates || 0 }), _jsx(Typography, { variant: "body2", children: "Total Candidates" })] }), _jsx(PeopleIcon, { sx: { fontSize: 48, opacity: 0.7 } })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'success.main', color: 'white' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", fontWeight: "bold", children: dashboardData?.completedOnboarding || 0 }), _jsx(Typography, { variant: "body2", children: "Onboarding Completed" })] }), _jsx(CheckCircleIcon, { sx: { fontSize: 48, opacity: 0.7 } })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'warning.main', color: 'white' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", fontWeight: "bold", children: dashboardData?.incompleteOnboarding || 0 }), _jsx(Typography, { variant: "body2", children: "Onboarding Incomplete" })] }), _jsx(HourglassIcon, { sx: { fontSize: 48, opacity: 0.7 } })] }) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { sx: { bgcolor: 'info.main', color: 'white' }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", fontWeight: "bold", children: dashboardData?.enrolled || 0 }), _jsx(Typography, { variant: "body2", children: "Enrolled in Training" })] }), _jsx(SchoolIcon, { sx: { fontSize: 48, opacity: 0.7 } })] }) }) }) })] }), _jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Screening Pipeline" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 6, sm: 4, md: 2.4, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(PendingIcon, { sx: { fontSize: 32, color: '#2196f3', mb: 1 } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", color: "primary", children: dashboardData?.pendingScreening || 0 }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Evaluation Pending" })] }) }) }), _jsx(Grid, { item: true, xs: 6, sm: 4, md: 2.4, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(TrendingUpIcon, { sx: { fontSize: 32, color: '#9c27b0', mb: 1 } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", sx: { color: '#9c27b0' }, children: dashboardData?.pendingOrientation || 0 }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Pending Orientation" })] }) }) }), _jsx(Grid, { item: true, xs: 6, sm: 4, md: 2.4, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(HourglassIcon, { sx: { fontSize: 32, color: '#00bcd4', mb: 1 } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", sx: { color: '#00bcd4' }, children: dashboardData?.pendingEnroll || 0 }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Pending Enroll" })] }) }) }), _jsx(Grid, { item: true, xs: 6, sm: 4, md: 2.4, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(CheckCircleIcon, { sx: { fontSize: 32, color: '#4caf50', mb: 1 } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", color: "success.main", children: dashboardData?.enrolled || 0 }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Enrolled" })] }) }) }), _jsx(Grid, { item: true, xs: 6, sm: 4, md: 2.4, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(CancelIcon, { sx: { fontSize: 32, color: '#f44336', mb: 1 } }), _jsx(Typography, { variant: "h4", fontWeight: "bold", color: "error", children: dashboardData?.dropped || 0 }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Dropped" })] }) }) })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: ["Monthly Onboarding Status (", selectedYear, ")"] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: dashboardData?.monthlyOnboardingData || [], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "monthName" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "completed", name: "Completed", fill: COLORS.completed }), _jsx(Bar, { dataKey: "incomplete", name: "Incomplete", fill: COLORS.incomplete })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Onboarding Status Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: onboardingPieData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: onboardingPieData.map((_, index) => (_jsx(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: ["Monthly Screening Pipeline (", selectedYear, ")"] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: dashboardData?.monthlyWorkflowData || [], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "monthName" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "pendingScreening", name: "Evaluation Pending", stroke: "#2196f3", strokeWidth: 2 }), _jsx(Line, { type: "monotone", dataKey: "pendingOrientation", name: "Pending Orientation", stroke: "#9c27b0", strokeWidth: 2 }), _jsx(Line, { type: "monotone", dataKey: "pendingEnroll", name: "Pending Enroll", stroke: "#00bcd4", strokeWidth: 2 }), _jsx(Line, { type: "monotone", dataKey: "enrolled", name: "Enrolled", stroke: "#4caf50", strokeWidth: 2 }), _jsx(Line, { type: "monotone", dataKey: "dropped", name: "Dropped", stroke: "#f44336", strokeWidth: 2 })] }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Screening Pipeline Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: workflowPieData, cx: "50%", cy: "50%", labelLine: false, label: ({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: workflowPieData.map((_, index) => (_jsx(Cell, { fill: WORKFLOW_COLORS[index % WORKFLOW_COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, children: ["Monthly Candidate Flow (", selectedYear, ")"] }), _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(BarChart, { data: dashboardData?.monthlyWorkflowData || [], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "monthName" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "pendingScreening", name: "Evaluation Pending", stackId: "a", fill: "#2196f3" }), _jsx(Bar, { dataKey: "pendingOrientation", name: "Pending Orientation", stackId: "a", fill: "#9c27b0" }), _jsx(Bar, { dataKey: "pendingEnroll", name: "Pending Enroll", stackId: "a", fill: "#00bcd4" }), _jsx(Bar, { dataKey: "enrolled", name: "Enrolled", stackId: "a", fill: "#4caf50" }), _jsx(Bar, { dataKey: "dropped", name: "Dropped", stackId: "a", fill: "#f44336" })] }) })] }) })] })] }));
}
