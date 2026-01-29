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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import {
  Search as SearchIcon,
  HowToReg as EnrollIcon,
  Refresh as RefreshIcon,
  Event as EventIcon,
} from '@mui/icons-material'
import { screeningApi, CandidateWorkflowDTO } from '@services/screening.service'
import { trainingBatchApi, TrainingBatchDTO } from '@services/training.service'
import { useAdminAuth } from '@context/AdminAuthContext'

export default function Enroll() {
  const { user } = useAdminAuth()
  const [candidates, setCandidates] = useState<CandidateWorkflowDTO[]>([])
  const [availableBatches, setAvailableBatches] = useState<TrainingBatchDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWorkflowDTO | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [candidatesData, batchesData] = await Promise.all([
        screeningApi.getPendingEnrollment(),
        trainingBatchApi.getAvailable()
      ])
      setCandidates(candidatesData)
      setAvailableBatches(batchesData)
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenDialog = (candidate: CandidateWorkflowDTO) => {
    setSelectedCandidate(candidate)
    setSelectedBatchId('')
    setNotes('')
    setDialogOpen(true)
  }

  const handleEnroll = async () => {
    if (!selectedCandidate || !user || !selectedBatchId) return
    
    setProcessing(true)
    try {
      await screeningApi.enrollCandidate({
        candidateWorkflowId: selectedCandidate.id,
        trainingBatchId: selectedBatchId as number,
        notes
      }, user.userId)
      
      setDialogOpen(false)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to enroll candidate')
    } finally {
      setProcessing(false)
    }
  }

  const filteredCandidates = candidates.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.phoneNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const selectedBatch = availableBatches.find(b => b.id === selectedBatchId)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EnrollIcon sx={{ fontSize: 32, mr: 1, color: 'success.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Enrollment
          </Typography>
          <Chip 
            label={candidates.length} 
            color="success" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {availableBatches.length === 0 && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No training batches available. Please create training batches first.
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email or phone..."
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
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>City</strong></TableCell>
                  <TableCell><strong>Orientation Completed</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate) => (
                    <TableRow key={candidate.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {candidate.firstName} {candidate.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{candidate.email || '-'}</TableCell>
                      <TableCell>{candidate.phoneNumber}</TableCell>
                      <TableCell>{candidate.city}, {candidate.state}</TableCell>
                      <TableCell>{formatDate(candidate.orientationCompletedAt)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Enroll in Training">
                          <IconButton 
                            color="success" 
                            onClick={() => handleOpenDialog(candidate)}
                            disabled={availableBatches.length === 0}
                          >
                            <EnrollIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredCandidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No candidates pending enrollment
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredCandidates.length}
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

      {/* Enrollment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Enroll Candidate - {selectedCandidate?.firstName} {selectedCandidate?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Email:</strong> {selectedCandidate?.email || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Phone:</strong> {selectedCandidate?.phoneNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Location:</strong> {selectedCandidate?.city}, {selectedCandidate?.state}
                </Typography>
              </Grid>
            </Grid>
            
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Select Training Batch</InputLabel>
              <Select
                value={selectedBatchId}
                label="Select Training Batch"
                onChange={(e) => setSelectedBatchId(e.target.value as number)}
              >
                {availableBatches.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.trainingName} - {batch.batchCode} ({batch.availableSlots} slots available)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedBatch && (
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedBatch.trainingName}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <EventIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        <strong>Duration:</strong> {formatDate(selectedBatch.startDate)} - {formatDate(selectedBatch.endDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Location:</strong> {selectedBatch.location || 'TBD'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Trainer:</strong> {selectedBatch.trainerName || 'TBD'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Skill:</strong> {selectedBatch.skillCategory || 'General'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Chip 
                        label={`${selectedBatch.availableSlots} of ${selectedBatch.maxCapacity} slots available`}
                        color="success"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Enrollment Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this enrollment..."
              sx={{ mt: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<EnrollIcon />}
            onClick={handleEnroll}
            disabled={processing || !selectedBatchId}
          >
            {processing ? <CircularProgress size={20} /> : 'Enroll Candidate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
