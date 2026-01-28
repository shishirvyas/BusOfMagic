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
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  HourglassEmpty as HourglassIcon,
  CheckCircle as ApproveIcon,
  PauseCircle as HoldIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { screeningApi, CandidateWorkflowDTO } from '@services/screening.service'
import { useAdminAuth } from '@context/AdminAuthContext'

export default function UnderScreening() {
  const { user } = useAdminAuth()
  const [candidates, setCandidates] = useState<CandidateWorkflowDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWorkflowDTO | null>(null)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  const fetchCandidates = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await screeningApi.getPendingScreening()
      setCandidates(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const handleOpenDialog = (candidate: CandidateWorkflowDTO) => {
    setSelectedCandidate(candidate)
    setNotes('')
    setDialogOpen(true)
  }

  const handleCompleteScreening = async (approved: boolean) => {
    if (!selectedCandidate || !user) return
    
    setProcessing(true)
    try {
      await screeningApi.completeScreening({
        candidateWorkflowId: selectedCandidate.id,
        notes,
        approved
      }, user.userId)
      
      setDialogOpen(false)
      fetchCandidates()
    } catch (err: any) {
      setError(err.message || 'Failed to update screening status')
    } finally {
      setProcessing(false)
    }
  }

  const filteredCandidates = candidates.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.phoneNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HourglassIcon sx={{ fontSize: 32, mr: 1, color: 'warning.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Under Screening
          </Typography>
          <Chip 
            label={candidates.length} 
            color="warning" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchCandidates}
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
                  <TableCell><strong>Gender</strong></TableCell>
                  <TableCell><strong>Registered On</strong></TableCell>
                  <TableCell align="center"><strong>Dropout Score</strong></TableCell>
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
                      <TableCell>
                        <Chip 
                          label={candidate.gender} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(candidate.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={candidate.engagementScore ? candidate.engagementScore.toFixed(1) : '-'}
                          color={candidate.engagementScore && candidate.engagementScore >= 60 ? 'success' : candidate.engagementScore && candidate.engagementScore >= 40 ? 'warning' : 'error'}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View & Process">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(candidate)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredCandidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No candidates pending screening
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

      {/* Screening Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Complete Screening - {selectedCandidate?.firstName} {selectedCandidate?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Email:</strong> {selectedCandidate?.email || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Phone:</strong> {selectedCandidate?.phoneNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Location:</strong> {selectedCandidate?.city}, {selectedCandidate?.state}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>DOB:</strong> {selectedCandidate?.dateOfBirth}
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Screening Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this screening..."
              sx={{ mt: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<HoldIcon />}
            onClick={() => handleCompleteScreening(false)}
            disabled={processing}
          >
            Put On Hold
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<ApproveIcon />}
            onClick={() => handleCompleteScreening(true)}
            disabled={processing}
          >
            {processing ? <CircularProgress size={20} /> : 'Approve & Move to Orientation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
