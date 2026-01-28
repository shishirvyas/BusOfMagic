import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Role, Permission } from '@/types/auth.types';
import { roleApi, permissionApi } from '@/services/auth.service';
import { useAdminAuth } from '@/context/AdminAuthContext';

const RoleManagement: React.FC = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Form state
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        roleApi.getAll(),
        permissionApi.getGroupedByModule(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      setRoleForm({
        name: role.name,
        description: role.description || '',
      });
    } else {
      setSelectedRole(null);
      setRoleForm({ name: '', description: '' });
    }
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setSelectedRole(null);
    setRoleForm({ name: '', description: '' });
  };

  const handleSaveRole = async () => {
    try {
      if (selectedRole) {
        await roleApi.update(selectedRole.id, roleForm);
      } else {
        await roleApi.create({ ...roleForm, permissions: [] });
      }
      await loadData();
      handleCloseRoleDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.name === 'SUPER_ADMIN') {
      setError('Cannot delete SUPER_ADMIN role');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      try {
        await roleApi.delete(role.id);
        await loadData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete role');
      }
    }
  };

  const handleOpenPermissionDialog = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions([...role.permissions]);
    setOpenPermissionDialog(true);
  };

  const handleClosePermissionDialog = () => {
    setOpenPermissionDialog(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handlePermissionToggle = (permissionCode: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionCode)
        ? prev.filter(p => p !== permissionCode)
        : [...prev, permissionCode]
    );
  };

  const handleSelectAllInModule = (module: string) => {
    const modulePermissions = permissions[module]?.map(p => p.code) || [];
    const allSelected = modulePermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !modulePermissions.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissions])]);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    
    try {
      await roleApi.updatePermissions(selectedRole.id, selectedPermissions);
      await loadData();
      handleClosePermissionDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to update permissions');
    }
  };

  if (!isSuperAdmin()) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access this page. Only Super Admin can manage roles.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Role Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenRoleDialog()}
        >
          Create Role
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Permissions</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} hover>
                <TableCell>
                  <Typography fontWeight="medium">{role.name}</Typography>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {role.permissions.slice(0, 3).map((perm) => (
                      <Chip key={perm} label={perm} size="small" color="primary" variant="outlined" />
                    ))}
                    {role.permissions.length > 3 && (
                      <Tooltip title={role.permissions.slice(3).join(', ')}>
                        <Chip label={`+${role.permissions.length - 3} more`} size="small" color="default" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={role.isActive ? 'Active' : 'Inactive'} 
                    color={role.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Permissions">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenPermissionDialog(role)}
                    >
                      <SecurityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Role">
                    <IconButton 
                      color="info" 
                      onClick={() => handleOpenRoleDialog(role)}
                      disabled={role.name === 'SUPER_ADMIN'}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Role">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteRole(role)}
                      disabled={role.name === 'SUPER_ADMIN'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Role Create/Edit Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={roleForm.name}
            onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
            disabled={selectedRole?.name === 'SUPER_ADMIN'}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={roleForm.description}
            onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Assignment Dialog */}
      <Dialog 
        open={openPermissionDialog} 
        onClose={handleClosePermissionDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Manage Permissions for: <strong>{selectedRole?.name}</strong>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Select the permissions to assign to this role. Permissions are grouped by module.
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={`${selectedPermissions.length} permissions selected`} 
              color="primary" 
              variant="outlined"
            />
          </Box>

          {Object.entries(permissions).map(([module, modulePermissions]) => {
            const allSelected = modulePermissions.every(p => selectedPermissions.includes(p.code));
            const someSelected = modulePermissions.some(p => selectedPermissions.includes(p.code));
            
            return (
              <Accordion key={module} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={() => handleSelectAllInModule(module)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Typography fontWeight="medium">{module}</Typography>
                    <Chip 
                      label={`${modulePermissions.filter(p => selectedPermissions.includes(p.code)).length}/${modulePermissions.length}`}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    {modulePermissions.map((permission) => (
                      <FormControlLabel
                        key={permission.code}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(permission.code)}
                            onChange={() => handlePermissionToggle(permission.code)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {permission.name}
                              <Chip 
                                label={permission.code} 
                                size="small" 
                                sx={{ ml: 1, fontSize: '0.7rem' }}
                              />
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {permission.description}
                            </Typography>
                          </Box>
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionDialog}>Cancel</Button>
          <Button onClick={handleSavePermissions} variant="contained" color="primary">
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
