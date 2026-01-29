import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Grid,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationCity as CityIcon,
  Map as StateIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

interface State {
  id: number
  stateCode: string
  stateName: string
  isActive: boolean
  cityCount?: number
  createdAt?: string
  updatedAt?: string
}

interface City {
  id: number
  cityName: string
  stateId: number
  stateName: string
  stateCode: string
  pincode?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Locations() {
  const [tabValue, setTabValue] = useState(0)
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // State Dialog
  const [stateDialogOpen, setStateDialogOpen] = useState(false)
  const [editingState, setEditingState] = useState<State | null>(null)
  const [stateForm, setStateForm] = useState({ stateCode: '', stateName: '', isActive: true })
  
  // City Dialog
  const [cityDialogOpen, setCityDialogOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [cityForm, setCityForm] = useState({ cityName: '', stateId: 0, pincode: '', isActive: true })
  const [selectedStateFilter, setSelectedStateFilter] = useState<number | 'all'>('all')
  
  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  useEffect(() => {
    fetchStates()
    fetchCities()
  }, [])

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/locations/states')
      if (response.ok) {
        const data = await response.json()
        setStates(data)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
      showNotification('Failed to fetch states', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/locations/cities')
      if (response.ok) {
        const data = await response.json()
        setCities(data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      showNotification('Failed to fetch cities', 'error')
    }
  }

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  // ==================== STATE HANDLERS ====================

  const handleOpenStateDialog = (state?: State) => {
    if (state) {
      setEditingState(state)
      setStateForm({ stateCode: state.stateCode, stateName: state.stateName, isActive: state.isActive })
    } else {
      setEditingState(null)
      setStateForm({ stateCode: '', stateName: '', isActive: true })
    }
    setStateDialogOpen(true)
  }

  const handleCloseStateDialog = () => {
    setStateDialogOpen(false)
    setEditingState(null)
    setStateForm({ stateCode: '', stateName: '', isActive: true })
  }

  const handleSaveState = async () => {
    try {
      const url = editingState 
        ? `/api/locations/states/${editingState.id}`
        : '/api/locations/states'
      const method = editingState ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateForm)
      })
      
      if (response.ok) {
        showNotification(editingState ? 'State updated successfully' : 'State created successfully', 'success')
        handleCloseStateDialog()
        fetchStates()
      } else {
        const error = await response.text()
        showNotification(error || 'Failed to save state', 'error')
      }
    } catch (error) {
      console.error('Error saving state:', error)
      showNotification('Failed to save state', 'error')
    }
  }

  const handleDeleteState = async (id: number) => {
    if (!confirm('Are you sure you want to delete this state? This will also delete all cities in this state.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/locations/states/${id}`, { method: 'DELETE' })
      if (response.ok) {
        showNotification('State deleted successfully', 'success')
        fetchStates()
        fetchCities()
      } else {
        showNotification('Failed to delete state', 'error')
      }
    } catch (error) {
      console.error('Error deleting state:', error)
      showNotification('Failed to delete state', 'error')
    }
  }

  // ==================== CITY HANDLERS ====================

  const handleOpenCityDialog = (city?: City) => {
    if (city) {
      setEditingCity(city)
      setCityForm({ cityName: city.cityName, stateId: city.stateId, pincode: city.pincode || '', isActive: city.isActive })
    } else {
      setEditingCity(null)
      setCityForm({ cityName: '', stateId: states[0]?.id || 0, pincode: '', isActive: true })
    }
    setCityDialogOpen(true)
  }

  const handleCloseCityDialog = () => {
    setCityDialogOpen(false)
    setEditingCity(null)
    setCityForm({ cityName: '', stateId: 0, pincode: '', isActive: true })
  }

  const handleSaveCity = async () => {
    try {
      const url = editingCity 
        ? `/api/locations/cities/${editingCity.id}`
        : '/api/locations/cities'
      const method = editingCity ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm)
      })
      
      if (response.ok) {
        showNotification(editingCity ? 'City updated successfully' : 'City created successfully', 'success')
        handleCloseCityDialog()
        fetchCities()
        fetchStates() // Refresh city counts
      } else {
        const error = await response.text()
        showNotification(error || 'Failed to save city', 'error')
      }
    } catch (error) {
      console.error('Error saving city:', error)
      showNotification('Failed to save city', 'error')
    }
  }

  const handleDeleteCity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this city?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/locations/cities/${id}`, { method: 'DELETE' })
      if (response.ok) {
        showNotification('City deleted successfully', 'success')
        fetchCities()
        fetchStates() // Refresh city counts
      } else {
        showNotification('Failed to delete city', 'error')
      }
    } catch (error) {
      console.error('Error deleting city:', error)
      showNotification('Failed to delete city', 'error')
    }
  }

  // ==================== FILTERING ====================

  const filteredStates = states.filter(state =>
    state.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.stateCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.stateName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedStateFilter === 'all' || city.stateId === selectedStateFilter
    return matchesSearch && matchesState
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Locations Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => { fetchStates(); fetchCities(); }}
        >
          Refresh
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, newValue) => { setTabValue(newValue); setSearchTerm(''); }}>
              <Tab icon={<StateIcon />} iconPosition="start" label={`States (${states.length})`} />
              <Tab icon={<CityIcon />} iconPosition="start" label={`Cities (${cities.length})`} />
            </Tabs>
          </Box>

          {/* States Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 300 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenStateDialog()}
              >
                Add State
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Code</strong></TableCell>
                    <TableCell><strong>State Name</strong></TableCell>
                    <TableCell align="center"><strong>Cities</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStates.map((state) => (
                    <TableRow key={state.id} hover>
                      <TableCell>
                        <Chip label={state.stateCode} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>{state.stateName}</TableCell>
                      <TableCell align="center">
                        <Chip label={state.cityCount || 0} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={state.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={state.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleOpenStateDialog(state)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteState(state.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          {searchTerm ? 'No states found matching your search' : 'No states available'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Cities Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by State</InputLabel>
                  <Select
                    value={selectedStateFilter}
                    label="Filter by State"
                    onChange={(e) => setSelectedStateFilter(e.target.value as number | 'all')}
                  >
                    <MenuItem value="all">All States</MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCityDialog()}
                  disabled={states.length === 0}
                >
                  Add City
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>City Name</strong></TableCell>
                    <TableCell><strong>State</strong></TableCell>
                    <TableCell><strong>Pincode</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCities.map((city) => (
                    <TableRow key={city.id} hover>
                      <TableCell>{city.cityName}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={city.stateCode} size="small" variant="outlined" />
                          {city.stateName}
                        </Box>
                      </TableCell>
                      <TableCell>{city.pincode || '-'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={city.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={city.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleOpenCityDialog(city)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteCity(city.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          {searchTerm || selectedStateFilter !== 'all' 
                            ? 'No cities found matching your criteria' 
                            : 'No cities available'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>

      {/* State Dialog */}
      <Dialog open={stateDialogOpen} onClose={handleCloseStateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingState ? 'Edit State' : 'Add New State'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="State Code"
              placeholder="e.g., MH, KA, TN"
              value={stateForm.stateCode}
              onChange={(e) => setStateForm({ ...stateForm, stateCode: e.target.value.toUpperCase() })}
              inputProps={{ maxLength: 10 }}
              required
            />
            <TextField
              fullWidth
              label="State Name"
              placeholder="e.g., Maharashtra, Karnataka"
              value={stateForm.stateName}
              onChange={(e) => setStateForm({ ...stateForm, stateName: e.target.value })}
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={stateForm.isActive}
                  onChange={(e) => setStateForm({ ...stateForm, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStateDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveState}
            disabled={!stateForm.stateCode || !stateForm.stateName}
          >
            {editingState ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* City Dialog */}
      <Dialog open={cityDialogOpen} onClose={handleCloseCityDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCity ? 'Edit City' : 'Add New City'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="City Name"
              placeholder="e.g., Mumbai, Bangalore"
              value={cityForm.cityName}
              onChange={(e) => setCityForm({ ...cityForm, cityName: e.target.value })}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>State</InputLabel>
              <Select
                value={cityForm.stateId || ''}
                label="State"
                onChange={(e) => setCityForm({ ...cityForm, stateId: e.target.value as number })}
              >
                {states.filter(s => s.isActive).map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.stateName} ({state.stateCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Pincode"
              placeholder="e.g., 400001"
              value={cityForm.pincode}
              onChange={(e) => setCityForm({ ...cityForm, pincode: e.target.value })}
              inputProps={{ maxLength: 10 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={cityForm.isActive}
                  onChange={(e) => setCityForm({ ...cityForm, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCityDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCity}
            disabled={!cityForm.cityName || !cityForm.stateId}
          >
            {editingCity ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
