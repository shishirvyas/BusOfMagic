import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility,
  VisibilityOff,
  ToggleOn,
  ToggleOff,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { adminApi, roleApi } from '@/services/auth.service';
import { AdminUser, Role, CreateAdminRequest } from '@/types/auth.types';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface StateOption {
  id: number;
  stateName: string;
  stateCode: string;
}

interface CityOption {
  id: number;
  cityName: string;
  stateId: number;
}

const initialFormData: CreateAdminRequest = {
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
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityOption[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<CreateAdminRequest>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);

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
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
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
    } else {
      setFilteredCities([]);
    }
  }, [formData.stateId, cities]);

  const handleOpenDialog = (admin?: AdminUser) => {
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
    } else {
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

  const handleFormChange = (field: keyof CreateAdminRequest, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Reset city when state changes
      if (field === 'stateId') {
        updated.cityId = undefined;
      }
      return updated;
    });
  };

  const validateForm = (): boolean => {
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
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setFormError('');
      
      if (editingAdmin) {
        await adminApi.update(editingAdmin.id, formData);
        setSuccess('Admin updated successfully');
      } else {
        await adminApi.create(formData);
        setSuccess('Admin created successfully');
      }
      
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    try {
      await adminApi.toggleStatus(admin.id);
      setSuccess(`Admin ${admin.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchData();
    } catch (err) {
      setError('Failed to toggle admin status');
    }
  };

  const handleDeleteClick = (admin: AdminUser) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;
    
    try {
      await adminApi.delete(adminToDelete.id);
      setSuccess('Admin deleted successfully');
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
      fetchData();
    } catch (err) {
      setError('Failed to delete admin');
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'SUPER_ADMIN': return 'error';
      case 'STATE_ADMIN': return 'primary';
      case 'CITY_ADMIN': return 'secondary';
      default: return 'default';
    }
  };

  if (!isSuperAdmin()) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Only Super Admins can access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Admin
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Admin Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={admin.roleName}
                        color={getRoleColor(admin.roleName) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{admin.stateName || '-'}</TableCell>
                    <TableCell>{admin.cityName || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={admin.isActive ? 'Active' : 'Inactive'}
                        color={admin.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {admin.lastLogin
                        ? new Date(admin.lastLogin).toLocaleString()
                        : 'Never'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(admin)}
                          disabled={admin.id === user?.userId}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={admin.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(admin)}
                          disabled={admin.id === user?.userId}
                          color={admin.isActive ? 'success' : 'default'}
                        >
                          {admin.isActive ? <ToggleOn fontSize="small" /> : <ToggleOff fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(admin)}
                          disabled={admin.id === user?.userId}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {admins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      No admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {formError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Username"
            value={formData.username}
            onChange={(e) => handleFormChange('username', e.target.value)}
            disabled={!!editingAdmin}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label={editingAdmin ? 'New Password (leave empty to keep current)' : 'Password'}
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleFormChange('password', e.target.value)}
            margin="normal"
            required={!editingAdmin}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleFormChange('firstName', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleFormChange('lastName', e.target.value)}
              margin="normal"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleFormChange('phone', e.target.value)}
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.roleId || ''}
              label="Role"
              onChange={(e) => handleFormChange('roleId', e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name} - {role.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              value={formData.stateId || ''}
              label="State"
              onChange={(e) => handleFormChange('stateId', e.target.value || undefined)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.stateName} ({state.stateCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" disabled={!formData.stateId}>
            <InputLabel>City</InputLabel>
            <Select
              value={formData.cityId || ''}
              label="City"
              onChange={(e) => handleFormChange('cityId', e.target.value || undefined)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filteredCities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.cityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : editingAdmin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete admin "{adminToDelete?.username}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
