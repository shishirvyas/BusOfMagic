import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  LinearProgress,
  Tooltip,
  Avatar,
  AvatarGroup,
} from '@mui/material'
import {
  CalendarMonth as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  EventAvailable as EventAvailableIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

interface EnrolledCandidate {
  candidateId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  city: string
  state: string
  gender: string
  enrolledAt: string | null
  enrolledByName: string | null
}

interface TrainingCalendarData {
  batchId: number
  batchCode: string
  trainingId: number
  trainingName: string
  skillCategory: string
  startDate: string
  endDate: string
  durationDays: number
  location: string
  trainerName: string
  maxCapacity: number
  currentEnrolled: number
  availableSlots: number
  isActive: boolean
  enrolledCandidates: EnrolledCandidate[]
}

interface CalendarSummary {
  totalActiveBatches: number
  upcomingBatches: number
  ongoingBatches: number
  totalCapacity: number
  totalEnrolled: number
  totalAvailableSlots: number
  occupancyRate: number
}

export default function TrainingCalendar() {
  const [calendarData, setCalendarData] = useState<TrainingCalendarData[]>([])
  const [summary, setSummary] = useState<CalendarSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedBatch, setExpandedBatch] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  const fetchCalendarData = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterStatus === 'active') params.append('activeOnly', 'true')
      
      const [calendarRes, summaryRes] = await Promise.all([
        fetch(`/api/training-calendar?${params}`),
        fetch('/api/training-calendar/summary')
      ])
      
      if (!calendarRes.ok || !summaryRes.ok) {
        throw new Error('Failed to fetch calendar data')
      }
      
      const calendarJson = await calendarRes.json()
      const summaryJson = await summaryRes.json()
      
      setCalendarData(calendarJson)
      setSummary(summaryJson)
    } catch (err: any) {
      setError(err.message || 'Failed to load training calendar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendarData()
  }, [filterStatus])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getBatchStatus = (batch: TrainingCalendarData) => {
    const today = new Date()
    const startDate = new Date(batch.startDate)
    const endDate = new Date(batch.endDate)
    
    if (today < startDate) return { label: 'Upcoming', color: 'info' as const }
    if (today > endDate) return { label: 'Completed', color: 'default' as const }
    return { label: 'Ongoing', color: 'success' as const }
  }

  const getOccupancyColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100
    if (percentage >= 90) return 'error'
    if (percentage >= 70) return 'warning'
    return 'success'
  }

  const handleExpandClick = (batchId: number) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Training Calendar
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchCalendarData}
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

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{summary.totalActiveBatches}</Typography>
                    <Typography variant="body2">Active Batches</Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{summary.upcomingBatches}</Typography>
                    <Typography variant="body2">Upcoming</Typography>
                  </Box>
                  <EventAvailableIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{summary.totalEnrolled}</Typography>
                    <Typography variant="body2">Total Enrolled</Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">{summary.totalAvailableSlots}</Typography>
                    <Typography variant="body2">Slots Available</Typography>
                  </Box>
                  <CalendarIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                label="Status Filter"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Batches</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color="text.secondary">
              Showing {calendarData.length} training batch(es)
              {summary && ` • Occupancy: ${summary.occupancyRate.toFixed(1)}%`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Calendar Data Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell width={50}></TableCell>
                <TableCell><strong>Training / Batch</strong></TableCell>
                <TableCell><strong>Schedule</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Trainer</strong></TableCell>
                <TableCell align="center"><strong>Slots</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calendarData.map((batch) => {
                const status = getBatchStatus(batch)
                const isExpanded = expandedBatch === batch.batchId
                
                return (
                  <>
                    <TableRow 
                      key={batch.batchId} 
                      hover
                      sx={{ 
                        '& > *': { borderBottom: isExpanded ? 'unset' : undefined },
                        cursor: 'pointer',
                        bgcolor: isExpanded ? 'action.selected' : 'inherit'
                      }}
                      onClick={() => handleExpandClick(batch.batchId)}
                    >
                      <TableCell>
                        <IconButton size="small">
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">{batch.trainingName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {batch.batchCode} • {batch.skillCategory}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {batch.durationDays} days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          {batch.location || '-'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          {batch.trainerName || '-'}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box>
                          <Chip
                            label={`${batch.currentEnrolled} / ${batch.maxCapacity}`}
                            color={getOccupancyColor(batch.currentEnrolled, batch.maxCapacity)}
                            size="small"
                            variant="filled"
                          />
                          <LinearProgress
                            variant="determinate"
                            value={(batch.currentEnrolled / batch.maxCapacity) * 100}
                            color={getOccupancyColor(batch.currentEnrolled, batch.maxCapacity)}
                            sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {batch.availableSlots} remaining
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Enrolled Candidates ({batch.enrolledCandidates.length})
                            </Typography>
                            {batch.enrolledCandidates.length > 0 ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Phone</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell><strong>Enrolled On</strong></TableCell>
                                    <TableCell><strong>Enrolled By</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {batch.enrolledCandidates.map((candidate) => (
                                    <TableRow key={candidate.candidateId}>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Avatar sx={{ width: 28, height: 28, mr: 1, fontSize: 12 }}>
                                            {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                          </Avatar>
                                          {candidate.firstName} {candidate.lastName}
                                        </Box>
                                      </TableCell>
                                      <TableCell>{candidate.email || '-'}</TableCell>
                                      <TableCell>{candidate.phoneNumber}</TableCell>
                                      <TableCell>{candidate.city}, {candidate.state}</TableCell>
                                      <TableCell>
                                        {candidate.enrolledAt ? formatDate(candidate.enrolledAt) : '-'}
                                      </TableCell>
                                      <TableCell>{candidate.enrolledByName || '-'}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography color="text.secondary" sx={{ py: 2 }}>
                                No candidates enrolled yet
                              </Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                )
              })}
              {calendarData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No training batches found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  )
}
