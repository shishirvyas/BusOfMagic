import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tab, Tabs, FormControl, InputLabel, Select, MenuItem, Alert, Snackbar, Grid, Switch, FormControlLabel, InputAdornment, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, LocationCity as CityIcon, Map as StateIcon, Refresh as RefreshIcon } from '@mui/icons-material';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, ...other, children: value === index && _jsx(Box, { sx: { pt: 3 }, children: children }) }));
}
export default function Locations() {
    const [tabValue, setTabValue] = useState(0);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // State Dialog
    const [stateDialogOpen, setStateDialogOpen] = useState(false);
    const [editingState, setEditingState] = useState(null);
    const [stateForm, setStateForm] = useState({ stateCode: '', stateName: '', isActive: true });
    // City Dialog
    const [cityDialogOpen, setCityDialogOpen] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [cityForm, setCityForm] = useState({ cityName: '', stateId: 0, pincode: '', isActive: true });
    const [selectedStateFilter, setSelectedStateFilter] = useState('all');
    // Notifications
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    useEffect(() => {
        fetchStates();
        fetchCities();
    }, []);
    const fetchStates = async () => {
        try {
            const response = await fetch('/api/locations/states');
            if (response.ok) {
                const data = await response.json();
                setStates(data);
            }
        }
        catch (error) {
            console.error('Error fetching states:', error);
            showNotification('Failed to fetch states', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchCities = async () => {
        try {
            const response = await fetch('/api/locations/cities');
            if (response.ok) {
                const data = await response.json();
                setCities(data);
            }
        }
        catch (error) {
            console.error('Error fetching cities:', error);
            showNotification('Failed to fetch cities', 'error');
        }
    };
    const showNotification = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };
    // ==================== STATE HANDLERS ====================
    const handleOpenStateDialog = (state) => {
        if (state) {
            setEditingState(state);
            setStateForm({ stateCode: state.stateCode, stateName: state.stateName, isActive: state.isActive });
        }
        else {
            setEditingState(null);
            setStateForm({ stateCode: '', stateName: '', isActive: true });
        }
        setStateDialogOpen(true);
    };
    const handleCloseStateDialog = () => {
        setStateDialogOpen(false);
        setEditingState(null);
        setStateForm({ stateCode: '', stateName: '', isActive: true });
    };
    const handleSaveState = async () => {
        try {
            const url = editingState
                ? `/api/locations/states/${editingState.id}`
                : '/api/locations/states';
            const method = editingState ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stateForm)
            });
            if (response.ok) {
                showNotification(editingState ? 'State updated successfully' : 'State created successfully', 'success');
                handleCloseStateDialog();
                fetchStates();
            }
            else {
                const error = await response.text();
                showNotification(error || 'Failed to save state', 'error');
            }
        }
        catch (error) {
            console.error('Error saving state:', error);
            showNotification('Failed to save state', 'error');
        }
    };
    const handleDeleteState = async (id) => {
        if (!confirm('Are you sure you want to delete this state? This will also delete all cities in this state.')) {
            return;
        }
        try {
            const response = await fetch(`/api/locations/states/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showNotification('State deleted successfully', 'success');
                fetchStates();
                fetchCities();
            }
            else {
                showNotification('Failed to delete state', 'error');
            }
        }
        catch (error) {
            console.error('Error deleting state:', error);
            showNotification('Failed to delete state', 'error');
        }
    };
    // ==================== CITY HANDLERS ====================
    const handleOpenCityDialog = (city) => {
        if (city) {
            setEditingCity(city);
            setCityForm({ cityName: city.cityName, stateId: city.stateId, pincode: city.pincode || '', isActive: city.isActive });
        }
        else {
            setEditingCity(null);
            setCityForm({ cityName: '', stateId: states[0]?.id || 0, pincode: '', isActive: true });
        }
        setCityDialogOpen(true);
    };
    const handleCloseCityDialog = () => {
        setCityDialogOpen(false);
        setEditingCity(null);
        setCityForm({ cityName: '', stateId: 0, pincode: '', isActive: true });
    };
    const handleSaveCity = async () => {
        try {
            const url = editingCity
                ? `/api/locations/cities/${editingCity.id}`
                : '/api/locations/cities';
            const method = editingCity ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cityForm)
            });
            if (response.ok) {
                showNotification(editingCity ? 'City updated successfully' : 'City created successfully', 'success');
                handleCloseCityDialog();
                fetchCities();
                fetchStates(); // Refresh city counts
            }
            else {
                const error = await response.text();
                showNotification(error || 'Failed to save city', 'error');
            }
        }
        catch (error) {
            console.error('Error saving city:', error);
            showNotification('Failed to save city', 'error');
        }
    };
    const handleDeleteCity = async (id) => {
        if (!confirm('Are you sure you want to delete this city?')) {
            return;
        }
        try {
            const response = await fetch(`/api/locations/cities/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showNotification('City deleted successfully', 'success');
                fetchCities();
                fetchStates(); // Refresh city counts
            }
            else {
                showNotification('Failed to delete city', 'error');
            }
        }
        catch (error) {
            console.error('Error deleting city:', error);
            showNotification('Failed to delete city', 'error');
        }
    };
    // ==================== FILTERING ====================
    const filteredStates = states.filter(state => state.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.stateCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredCities = cities.filter(city => {
        const matchesSearch = city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.stateName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = selectedStateFilter === 'all' || city.stateId === selectedStateFilter;
        return matchesSearch && matchesState;
    });
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h4", children: "Locations Management" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(RefreshIcon, {}), onClick: () => { fetchStates(); fetchCities(); }, children: "Refresh" })] }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider' }, children: _jsxs(Tabs, { value: tabValue, onChange: (_, newValue) => { setTabValue(newValue); setSearchTerm(''); }, children: [_jsx(Tab, { icon: _jsx(StateIcon, {}), iconPosition: "start", label: `States (${states.length})` }), _jsx(Tab, { icon: _jsx(CityIcon, {}), iconPosition: "start", label: `Cities (${cities.length})` })] }) }), _jsxs(TabPanel, { value: tabValue, index: 0, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(TextField, { size: "small", placeholder: "Search states...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) }))
                                            }, sx: { width: 300 } }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenStateDialog(), children: "Add State" })] }), _jsx(TableContainer, { component: Paper, variant: "outlined", children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Code" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "State Name" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Cities" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredStates.map((state) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Chip, { label: state.stateCode, size: "small", color: "primary", variant: "outlined" }) }), _jsx(TableCell, { children: state.stateName }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: state.cityCount || 0, size: "small" }) }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: state.isActive ? 'Active' : 'Inactive', size: "small", color: state.isActive ? 'success' : 'default' }) }), _jsxs(TableCell, { align: "center", children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenStateDialog(state), children: _jsx(EditIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteState(state.id), children: _jsx(DeleteIcon, { fontSize: "small" }) }) })] })] }, state.id))), filteredStates.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "textSecondary", children: searchTerm ? 'No states found matching your search' : 'No states available' }) }) }))] })] }) })] }), _jsxs(TabPanel, { value: tabValue, index: 1, children: [_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { fullWidth: true, size: "small", placeholder: "Search cities...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) }))
                                                } }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsxs(FormControl, { fullWidth: true, size: "small", children: [_jsx(InputLabel, { children: "Filter by State" }), _jsxs(Select, { value: selectedStateFilter, label: "Filter by State", onChange: (e) => setSelectedStateFilter(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All States" }), states.map((state) => (_jsx(MenuItem, { value: state.id, children: state.stateName }, state.id)))] })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, sx: { display: 'flex', justifyContent: 'flex-end' }, children: _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenCityDialog(), disabled: states.length === 0, children: "Add City" }) })] }), _jsx(TableContainer, { component: Paper, variant: "outlined", children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: 'grey.100' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "City Name" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "State" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Pincode" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { align: "center", children: _jsx("strong", { children: "Actions" }) })] }) }), _jsxs(TableBody, { children: [filteredCities.map((city) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: city.cityName }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Chip, { label: city.stateCode, size: "small", variant: "outlined" }), city.stateName] }) }), _jsx(TableCell, { children: city.pincode || '-' }), _jsx(TableCell, { align: "center", children: _jsx(Chip, { label: city.isActive ? 'Active' : 'Inactive', size: "small", color: city.isActive ? 'success' : 'default' }) }), _jsxs(TableCell, { align: "center", children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", onClick: () => handleOpenCityDialog(city), children: _jsx(EditIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", color: "error", onClick: () => handleDeleteCity(city.id), children: _jsx(DeleteIcon, { fontSize: "small" }) }) })] })] }, city.id))), filteredCities.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, align: "center", sx: { py: 4 }, children: _jsx(Typography, { color: "textSecondary", children: searchTerm || selectedStateFilter !== 'all'
                                                                    ? 'No cities found matching your criteria'
                                                                    : 'No cities available' }) }) }))] })] }) })] })] }) }), _jsxs(Dialog, { open: stateDialogOpen, onClose: handleCloseStateDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingState ? 'Edit State' : 'Add New State' }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(TextField, { fullWidth: true, label: "State Code", placeholder: "e.g., MH, KA, TN", value: stateForm.stateCode, onChange: (e) => setStateForm({ ...stateForm, stateCode: e.target.value.toUpperCase() }), inputProps: { maxLength: 10 }, required: true }), _jsx(TextField, { fullWidth: true, label: "State Name", placeholder: "e.g., Maharashtra, Karnataka", value: stateForm.stateName, onChange: (e) => setStateForm({ ...stateForm, stateName: e.target.value }), required: true }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: stateForm.isActive, onChange: (e) => setStateForm({ ...stateForm, isActive: e.target.checked }) }), label: "Active" })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseStateDialog, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSaveState, disabled: !stateForm.stateCode || !stateForm.stateName, children: editingState ? 'Update' : 'Create' })] })] }), _jsxs(Dialog, { open: cityDialogOpen, onClose: handleCloseCityDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingCity ? 'Edit City' : 'Add New City' }), _jsx(DialogContent, { children: _jsxs(Box, { sx: { pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(TextField, { fullWidth: true, label: "City Name", placeholder: "e.g., Mumbai, Bangalore", value: cityForm.cityName, onChange: (e) => setCityForm({ ...cityForm, cityName: e.target.value }), required: true }), _jsxs(FormControl, { fullWidth: true, required: true, children: [_jsx(InputLabel, { children: "State" }), _jsx(Select, { value: cityForm.stateId || '', label: "State", onChange: (e) => setCityForm({ ...cityForm, stateId: e.target.value }), children: states.filter(s => s.isActive).map((state) => (_jsxs(MenuItem, { value: state.id, children: [state.stateName, " (", state.stateCode, ")"] }, state.id))) })] }), _jsx(TextField, { fullWidth: true, label: "Pincode", placeholder: "e.g., 400001", value: cityForm.pincode, onChange: (e) => setCityForm({ ...cityForm, pincode: e.target.value }), inputProps: { maxLength: 10 } }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: cityForm.isActive, onChange: (e) => setCityForm({ ...cityForm, isActive: e.target.checked }) }), label: "Active" })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseCityDialog, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleSaveCity, disabled: !cityForm.cityName || !cityForm.stateId, children: editingCity ? 'Update' : 'Create' })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 4000, onClose: () => setSnackbar({ ...snackbar, open: false }), anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, children: _jsx(Alert, { onClose: () => setSnackbar({ ...snackbar, open: false }), severity: snackbar.severity, variant: "filled", children: snackbar.message }) })] }));
}
