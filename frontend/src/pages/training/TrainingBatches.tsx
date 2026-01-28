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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  EventNote as BatchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { trainingBatchApi, trainingMasterApi, TrainingBatchDTO, TrainingMasterDTO, CreateBatchRequest } from '@services/training.service'

export default function TrainingBatches() {
  const [batches, setBatches] = useState<TrainingBatchDTO[]>([])
  const [trainings, setTrainings] = useState<TrainingMasterDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<TrainingBatchDTO | null>(null)
  const [formData, setFormData] = useState<CreateBatchRequest>({
    trainingId: 0,
    batchCode: '',
    startDate: '',
    endDate: '',
    maxCapacity: 30,
    location: '',
    trainerName: ''
  })
  const [processing, setProcessing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [batchesData, trainingsData] = await Promise.all([
        trainingBatchApi.getAll(),
        trainingMasterApi.getActive()
      ])
      setBatches(batchesData)
      setTrainings(trainingsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenDialog = (batch?: TrainingBatchDTO) => {
    if (batch) {
      setEditingBatch(batch)
      setFormData({
        trainingId: batch.trainingId,
        batchCode: batch.batchCode,
        startDate: batch.startDate,
        endDate: batch.endDate,
        maxCapacity: batch.maxCapacity,
        location: batch.location || '',
        trainerName: batch.trainerName || ''
      })
    } else {
      setEditingBatch(null)
      setFormData({
        trainingId: trainings[0]?.id || 0,
        batchCode: '',
        startDate: '',
        endDate: '',
        maxCapacity: 30,
        location: '',
        trainerName: ''
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    setProcessing(true)
    setError(null)
    try {
      if (editingBatch) {
        await trainingBatchApi.update(editingBatch.id, formData)
        setSuccess('Batch updated successfully')
      } else {
        await trainingBatchApi.create(formData)
        setSuccess('Batch created successfully')
      }
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to save batch')
    } finally {
      setProcessing(false)
    }
  }

  const handleToggleActive = async (batch: TrainingBatchDTO) => {
    try {
      await trainingBatchApi.toggleActive(batch.id)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status')
    }
  }

  const handleDelete = async (batch: TrainingBatchDTO) => {
    if (!window.confirm(`Are you sure you want to delete batch "${batch.batchCode}"?`)) return
    
    try {
      await trainingBatchApi.delete(batch.id)
      setSuccess('Batch deleted successfully')
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to delete batch')
    }
  }

  const filteredBatches = batches.filter(b =>
    `${b.batchCode} ${b.trainingName} ${b.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCapacityColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100
    if (percentage >= 90) return 'error'
    if (percentage >= 70) return 'warning'
    return 'success'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BatchIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Training Batches
          </Typography>
        </Box>
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
            disabled={trainings.length === 0}
          >
            Add Batch
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

      {trainings.length === 0 && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No active trainings found. Please create trainings in Training Master first.
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search batches..."
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
                  <TableCell><strong>Batch Code</strong></TableCell>
                  <TableCell><strong>Training</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Trainer</strong></TableCell>
                  <TableCell><strong>Capacity</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBatches
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((batch) => (
                    <TableRow key={batch.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {batch.batchCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{batch.trainingName}</Typography>
                        <Chip 
                          label={batch.skillCategory || 'General'} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(batch.startDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          to {formatDate(batch.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>{batch.location || '-'}</TableCell>
                      <TableCell>{batch.trainerName || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <Typography variant="body2">
                            {batch.currentEnrolled} / {batch.maxCapacity}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(batch.currentEnrolled / batch.maxCapacity) * 100}
                            color={getCapacityColor(batch.currentEnrolled, batch.maxCapacity)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={batch.isActive}
                          onChange={() => handleToggleActive(batch)}
                          color="success"
                          size="small"
                        />
                        <Chip 
                          label={batch.isActive ? 'Active' : 'Inactive'}
                          color={batch.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(batch)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(batch)}
                            size="small"
                            disabled={batch.currentEnrolled > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredBatches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No batches found. Click "Add Batch" to create one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredBatches.length}
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
          {editingBatch ? 'Edit Batch' : 'Add New Batch'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Training Program</InputLabel>
                  <Select
                    value={formData.trainingId || ''}
                    label="Training Program"
                    onChange={(e) => setFormData({ ...formData, trainingId: e.target.value as number })}
                  >
                    {trainings.map((training) => (
                      <MenuItem key={training.id} value={training.id}>
                        {training.name} ({training.skillCategory || 'General'})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Batch Code"
                  value={formData.batchCode}
                  onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                  placeholder="e.g., BATCH-2026-001"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Capacity"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 30 })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Trainer Name"
                  value={formData.trainerName}
                  onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Mumbai Training Center"
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
            disabled={processing || !formData.batchCode || !formData.trainingId || !formData.startDate || !formData.endDate}
          >
            {processing ? <CircularProgress size={20} /> : (editingBatch ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
