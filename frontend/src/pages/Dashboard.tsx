import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  HourglassEmpty as HourglassIcon,
  Cancel as CancelIcon,
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

interface MonthlyOnboardingData {
  month: number
  monthName: string
  completed: number
  incomplete: number
  total: number
}

interface MonthlyWorkflowData {
  month: number
  monthName: string
  pendingScreening: number
  pendingOrientation: number
  pendingEnroll: number
  enrolled: number
  dropped: number
  total: number
}

interface DashboardData {
  totalCandidates: number
  completedOnboarding: number
  incompleteOnboarding: number
  pendingScreening: number
  pendingOrientation: number
  pendingEnroll: number
  enrolled: number
  dropped: number
  monthlyOnboardingData: MonthlyOnboardingData[]
  monthlyWorkflowData: MonthlyWorkflowData[]
}

const COLORS = {
  completed: '#4caf50',
  incomplete: '#ff9800',
  pendingScreening: '#2196f3',
  pendingOrientation: '#9c27b0',
  pendingEnroll: '#00bcd4',
  enrolled: '#4caf50',
  dropped: '#f44336',
}

const PIE_COLORS = ['#4caf50', '#ff9800']
const WORKFLOW_COLORS = ['#2196f3', '#9c27b0', '#00bcd4', '#4caf50', '#f44336']

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/dashboard/stats?year=${selectedYear}`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [selectedYear])

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  // Prepare pie chart data for onboarding status
  const onboardingPieData = dashboardData ? [
    { name: 'Completed', value: dashboardData.completedOnboarding },
    { name: 'Incomplete', value: dashboardData.incompleteOnboarding },
  ] : []

  // Prepare pie chart data for workflow status
  const workflowPieData = dashboardData ? [
    { name: 'Evaluation Pending', value: dashboardData.pendingScreening },
    { name: 'Pending Orientation', value: dashboardData.pendingOrientation },
    { name: 'Pending Enroll', value: dashboardData.pendingEnroll },
    { name: 'Enrolled', value: dashboardData.enrolled },
    { name: 'Dropped', value: dashboardData.dropped },
  ].filter(item => item.value > 0) : []

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value as number)}
          >
            {yearOptions.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {dashboardData?.totalCandidates || 0}
                  </Typography>
                  <Typography variant="body2">Total Candidates</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {dashboardData?.completedOnboarding || 0}
                  </Typography>
                  <Typography variant="body2">Onboarding Completed</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {dashboardData?.incompleteOnboarding || 0}
                  </Typography>
                  <Typography variant="body2">Onboarding Incomplete</Typography>
                </Box>
                <HourglassIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {dashboardData?.enrolled || 0}
                  </Typography>
                  <Typography variant="body2">Enrolled in Training</Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workflow Status Cards */}
      <Typography variant="h6" sx={{ mb: 2 }}>Screening Pipeline</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <PendingIcon sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {dashboardData?.pendingScreening || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Evaluation Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 32, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#9c27b0' }}>
                {dashboardData?.pendingOrientation || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending Orientation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <HourglassIcon sx={{ fontSize: 32, color: '#00bcd4', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#00bcd4' }}>
                {dashboardData?.pendingEnroll || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending Enroll
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {dashboardData?.enrolled || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Enrolled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CancelIcon sx={{ fontSize: 32, color: '#f44336', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="error">
                {dashboardData?.dropped || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dropped
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Monthly Onboarding Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Onboarding Status ({selectedYear})
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.monthlyOnboardingData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill={COLORS.completed} />
                <Bar dataKey="incomplete" name="Incomplete" fill={COLORS.incomplete} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Onboarding Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Onboarding Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={onboardingPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {onboardingPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Monthly Workflow Status Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Screening Pipeline ({selectedYear})
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.monthlyWorkflowData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pendingScreening" name="Evaluation Pending" stroke="#2196f3" strokeWidth={2} />
                <Line type="monotone" dataKey="pendingOrientation" name="Pending Orientation" stroke="#9c27b0" strokeWidth={2} />
                <Line type="monotone" dataKey="pendingEnroll" name="Pending Enroll" stroke="#00bcd4" strokeWidth={2} />
                <Line type="monotone" dataKey="enrolled" name="Enrolled" stroke="#4caf50" strokeWidth={2} />
                <Line type="monotone" dataKey="dropped" name="Dropped" stroke="#f44336" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Workflow Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Screening Pipeline Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workflowPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workflowPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={WORKFLOW_COLORS[index % WORKFLOW_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Stacked Bar Chart for Workflow */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Candidate Flow ({selectedYear})
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dashboardData?.monthlyWorkflowData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pendingScreening" name="Evaluation Pending" stackId="a" fill="#2196f3" />
                <Bar dataKey="pendingOrientation" name="Pending Orientation" stackId="a" fill="#9c27b0" />
                <Bar dataKey="pendingEnroll" name="Pending Enroll" stackId="a" fill="#00bcd4" />
                <Bar dataKey="enrolled" name="Enrolled" stackId="a" fill="#4caf50" />
                <Bar dataKey="dropped" name="Dropped" stackId="a" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
