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
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Key as KeyIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Permission, Role } from '@/types/auth.types';
import { permissionApi, roleApi } from '@/services/auth.service';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`permission-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PermissionManagement: React.FC = () => {
  const { isSuperAdmin, hasPermission } = useAdminAuth();
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [permissionsData, rolesData] = await Promise.all([
        permissionApi.getGroupedByModule(),
        roleApi.getAll(),
      ]);
      setPermissions(permissionsData);
      setRoles(rolesData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filterPermissions = (perms: Permission[]) => {
    if (!searchTerm) return perms;
    const term = searchTerm.toLowerCase();
    return perms.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  };

  const getAllPermissions = (): Permission[] => {
    return Object.values(permissions).flat();
  };

  const filteredPermissions = searchTerm
    ? { filtered: filterPermissions(getAllPermissions()) }
    : permissions;

  if (!isSuperAdmin() && !hasPermission('PERMISSION_VIEW')) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You don't have permission to access this page.
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
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        <KeyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Permission Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Permissions" />
        <Tab label="Permission Matrix" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h3" color="primary">
                  {getAllPermissions().length}
                </Typography>
                <Typography color="textSecondary">Total Permissions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h3" color="secondary">
                  {Object.keys(permissions).length}
                </Typography>
                <Typography color="textSecondary">Modules</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h3" color="success.main">
                  {roles.length}
                </Typography>
                <Typography color="textSecondary">Roles</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Permissions by Module */}
        {Object.entries(searchTerm ? filteredPermissions : permissions).map(([module, modulePermissions]) => (
          <Paper key={module} sx={{ mb: 2 }}>
            <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                {module}
                <Chip 
                  label={modulePermissions.length} 
                  size="small" 
                  sx={{ ml: 2, backgroundColor: 'white', color: 'primary.main' }}
                />
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Code</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Assigned To Roles</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modulePermissions.map((permission) => {
                    const assignedRoles = roles.filter(r => 
                      r.permissions.includes(permission.code)
                    );
                    
                    return (
                      <TableRow key={permission.id} hover>
                        <TableCell>
                          <Chip 
                            label={permission.code} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{permission.name}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {permission.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={permission.isActive ? 'Active' : 'Inactive'}
                            color={permission.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {assignedRoles.map(role => (
                              <Chip 
                                key={role.id}
                                label={role.name}
                                size="small"
                                icon={<SecurityIcon />}
                              />
                            ))}
                            {assignedRoles.length === 0 && (
                              <Typography variant="caption" color="textSecondary">
                                Not assigned
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Permission Matrix */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Role-Permission Matrix
        </Typography>
        <Paper sx={{ overflow: 'auto' }}>
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: 'primary.main', 
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 200,
                    }}
                  >
                    Permission
                  </TableCell>
                  {roles.map(role => (
                    <TableCell 
                      key={role.id}
                      align="center"
                      sx={{ 
                        backgroundColor: 'primary.main', 
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: 120,
                      }}
                    >
                      {role.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(permissions).map(([module, modulePermissions]) => (
                  <React.Fragment key={module}>
                    <TableRow>
                      <TableCell 
                        colSpan={roles.length + 1}
                        sx={{ 
                          backgroundColor: 'grey.200',
                          fontWeight: 'bold',
                        }}
                      >
                        {module}
                      </TableCell>
                    </TableRow>
                    {modulePermissions.map(permission => (
                      <TableRow key={permission.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {permission.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {permission.code}
                          </Typography>
                        </TableCell>
                        {roles.map(role => (
                          <TableCell key={role.id} align="center">
                            {role.permissions.includes(permission.code) ? (
                              <Chip 
                                label="✓" 
                                color="success" 
                                size="small"
                                sx={{ minWidth: 32 }}
                              />
                            ) : (
                              <Typography color="textSecondary">—</Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default PermissionManagement;
