import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Switch,
  Grid,
} from '@mui/material'
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { trainingMasterApi, TrainingMasterDTO, CreateTrainingRequest } from '@services/training.service'

export default function TrainingMaster() {
  const [trainings, setTrainings] = useState<TrainingMasterDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTraining, setEditingTraining] = useState<TrainingMasterDTO | null>(null)
  const [formData, setFormData] = useState<CreateTrainingRequest>({
    name: '',
    description: '',
    skillCategory: '',
    durationDays: 0
  })
  const [processing, setProcessing] = useState(false)

  const fetchTrainings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await trainingMasterApi.getAll()
      setTrainings(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load trainings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainings()
  }, [])

  const handleOpenDialog = (training?: TrainingMasterDTO) => {
    if (training) {
      setEditingTraining(training)
      setFormData({
        name: training.name,
        description: training.description || '',
        skillCategory: training.skillCategory || '',
        durationDays: training.durationDays || 0
      })
    } else {
      setEditingTraining(null)
      setFormData({
        name: '',
        description: '',
        skillCategory: '',
        durationDays: 0
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    setProcessing(true)
    setError(null)
    try {
      if (editingTraining) {
        await trainingMasterApi.update(editingTraining.id, formData)
        setSuccess('Training updated successfully')
      } else {
        await trainingMasterApi.create(formData)
        setSuccess('Training created successfully')
      }
      setDialogOpen(false)
      fetchTrainings()
    } catch (err: any) {
      setError(err.message || 'Failed to save training')
    } finally {
      setProcessing(false)
    }
  }

  const handleToggleActive = async (training: TrainingMasterDTO) => {
    try {
      await trainingMasterApi.toggleActive(training.id)
      fetchTrainings()
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status')
    }
  }

  const handleDelete = async (training: TrainingMasterDTO) => {
    if (!window.confirm(`Are you sure you want to delete "${training.name}"?`)) return
    
    try {
      await trainingMasterApi.delete(training.id)
      setSuccess('Training deleted successfully')
      fetchTrainings()
    } catch (err: any) {
      setError(err.message || 'Failed to delete training')
    }
  }

  const filteredTrainings = trainings.filter(t =>
    `${t.name} ${t.skillCategory}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Training Master
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTrainings}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Training
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search trainings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Paper>

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Skill Category</strong></TableCell>
                  <TableCell><strong>Duration (Days)</strong></TableCell>
                  <TableCell><strong>Batches</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTrainings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((training) => (
                    <TableRow key={training.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {training.name}
                        </Typography>
                        {training.description && (
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                            {training.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={training.skillCategory || 'General'} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{training.durationDays || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {training.activeBatches} active / {training.totalBatches} total
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={training.isActive}
                          onChange={() => handleToggleActive(training)}
                          color="success"
                          size="small"
                        />
                        <Chip 
                          label={training.isActive ? 'Active' : 'Inactive'}
                          color={training.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(training)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(training)}
                            size="small"
                            disabled={training.totalBatches > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredTrainings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No trainings found. Click "Add Training" to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredTrainings.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
            />
          </>
        )}
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTraining ? 'Edit Training' : 'Add New Training'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Training Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Skill Category"
                  value={formData.skillCategory}
                  onChange={(e) => setFormData({ ...formData, skillCategory: e.target.value })}
                  placeholder="e.g., IT, Hospitality, Retail"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (Days)"
                  value={formData.durationDays || ''}
                  onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={processing || !formData.name}
          >
            {processing ? <CircularProgress size={20} /> : (editingTraining ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
