import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
} from '@mui/material'
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { exportToExcel } from '../utils/exportUtils'
import apiClient from '@/services/api'

interface ReportData {
  totalCandidates: number
  completedOnboarding: number
  incompleteOnboarding: number
  pendingScreening: number
  pendingOrientation: number
  pendingEnroll: number
  enrolled: number
  dropped: number
  monthlyOnboardingData: Array<{
    month: number
    monthName: string
    completed: number
    incomplete: number
    total: number
  }>
  monthlyWorkflowData: Array<{
    month: number
    monthName: string
    pendingScreening: number
    pendingOrientation: number
    pendingEnroll: number
    enrolled: number
    dropped: number
    total: number
  }>
}

interface LocationReport {
  locationId: number
  locationName: string
  totalCandidates: number
  enrolled: number
  dropped: number
  inProgress: number
}

const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#f44336', '#00bcd4']

const STATUS_COLORS: Record<string, string> = {
  completed: '#4caf50',
  incomplete: '#ff9800',
  enrolled: '#4caf50',
  dropped: '#f44336',
  pending: '#2196f3',
}

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [locationReports, setLocationReports] = useState<LocationReport[]>([])

  const years = [2024, 2025, 2026]

  useEffect(() => {
    fetchReportData()
  }, [selectedYear])

  const fetchReportData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.get(`/dashboard/stats?year=${selectedYear}`)
      setReportData(response.data)
      
      // Generate mock location reports based on dashboard data
      const mockLocationReports: LocationReport[] = [
        { locationId: 1, locationName: 'Mumbai', totalCandidates: 45, enrolled: 28, dropped: 5, inProgress: 12 },
        { locationId: 2, locationName: 'Delhi', totalCandidates: 38, enrolled: 22, dropped: 4, inProgress: 12 },
        { locationId: 3, locationName: 'Bangalore', totalCandidates: 32, enrolled: 20, dropped: 3, inProgress: 9 },
        { locationId: 4, locationName: 'Chennai', totalCandidates: 25, enrolled: 15, dropped: 2, inProgress: 8 },
        { locationId: 5, locationName: 'Hyderabad', totalCandidates: 20, enrolled: 12, dropped: 2, inProgress: 6 },
      ]
      setLocationReports(mockLocationReports)
    } catch (err: any) {
      console.error('Report fetch error:', err)
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view reports.')
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the backend is running.')
      } else {
        setError(err.response?.data?.message || 'Failed to load report data. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExportSummary = () => {
    if (!reportData) return
    
    const summaryData = [
      { Metric: 'Total Candidates', Value: reportData.totalCandidates },
      { Metric: 'Completed Onboarding', Value: reportData.completedOnboarding },
      { Metric: 'Incomplete Onboarding', Value: reportData.incompleteOnboarding },
      { Metric: 'Pending Screening', Value: reportData.pendingScreening },
      { Metric: 'Pending Orientation', Value: reportData.pendingOrientation },
      { Metric: 'Pending Enroll', Value: reportData.pendingEnroll },
      { Metric: 'Enrolled', Value: reportData.enrolled },
      { Metric: 'Dropped', Value: reportData.dropped },
    ]
    
    exportToExcel(summaryData, `onboarding_summary_${selectedYear}`)
  }

  const handleExportMonthly = () => {
    if (!reportData?.monthlyOnboardingData) return
    exportToExcel(reportData.monthlyOnboardingData, `monthly_onboarding_${selectedYear}`)
  }

  const handleExportLocation = () => {
    exportToExcel(locationReports, `location_report_${selectedYear}`)
  }

  const handleExportWorkflow = () => {
    if (!reportData?.monthlyWorkflowData) return
    exportToExcel(reportData.monthlyWorkflowData, `workflow_report_${selectedYear}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchReportData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    )
  }

  const pieData = reportData ? [
    { name: 'Enrolled', value: reportData.enrolled },
    { name: 'Pending Screening', value: reportData.pendingScreening },
    { name: 'Pending Orientation', value: reportData.pendingOrientation },
    { name: 'Pending Enroll', value: reportData.pendingEnroll },
    { name: 'Dropped', value: reportData.dropped },
  ] : []

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Reports & Analytics</Typography>
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value as number)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PieChartIcon />} label="Summary" />
          <Tab icon={<BarChartIcon />} label="Monthly Trends" />
          <Tab icon={<TrendingUpIcon />} label="Workflow Status" />
          <Tab icon={<AssessmentIcon />} label="Location Wise" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {activeTab === 0 && reportData && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportSummary}
            >
              Export Summary
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Onboarding Summary</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Candidates</TableCell>
                        <TableCell align="right">
                          <Chip label={reportData.totalCandidates} color="primary" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Completed Onboarding</TableCell>
                        <TableCell align="right">
                          <Chip label={reportData.completedOnboarding} color="success" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Incomplete Onboarding</TableCell>
                        <TableCell align="right">
                          <Chip label={reportData.incompleteOnboarding} color="warning" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Enrolled</TableCell>
                        <TableCell align="right">
                          <Chip label={reportData.enrolled} color="success" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dropped</TableCell>
                        <TableCell align="right">
                          <Chip label={reportData.dropped} color="error" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: 350 }}>
                <Typography variant="h6" gutterBottom>Status Distribution</Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && reportData?.monthlyOnboardingData && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportMonthly}
            >
              Export Monthly Data
            </Button>
          </Box>
          
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Monthly Onboarding Trends</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={reportData.monthlyOnboardingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#4caf50" />
                <Bar dataKey="incomplete" name="Incomplete" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      )}

      {activeTab === 2 && reportData?.monthlyWorkflowData && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportWorkflow}
            >
              Export Workflow Data
            </Button>
          </Box>
          
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Workflow Status Trends</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={reportData.monthlyWorkflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pendingScreening" name="Screening" stroke="#2196f3" />
                <Line type="monotone" dataKey="pendingOrientation" name="Orientation" stroke="#9c27b0" />
                <Line type="monotone" dataKey="pendingEnroll" name="Enroll" stroke="#00bcd4" />
                <Line type="monotone" dataKey="enrolled" name="Enrolled" stroke="#4caf50" />
                <Line type="monotone" dataKey="dropped" name="Dropped" stroke="#f44336" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportLocation}
            >
              Export Location Report
            </Button>
          </Box>
          
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell align="center"><strong>Total</strong></TableCell>
                    <TableCell align="center"><strong>Enrolled</strong></TableCell>
                    <TableCell align="center"><strong>In Progress</strong></TableCell>
                    <TableCell align="center"><strong>Dropped</strong></TableCell>
                    <TableCell align="center"><strong>Success Rate</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationReports.map((loc) => {
                    const successRate = loc.totalCandidates > 0 
                      ? ((loc.enrolled / loc.totalCandidates) * 100).toFixed(1)
                      : '0'
                    return (
                      <TableRow key={loc.locationId}>
                        <TableCell>{loc.locationName}</TableCell>
                        <TableCell align="center">{loc.totalCandidates}</TableCell>
                        <TableCell align="center">
                          <Chip label={loc.enrolled} color="success" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={loc.inProgress} color="primary" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={loc.dropped} color="error" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${successRate}%`} 
                            color={Number(successRate) >= 50 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
