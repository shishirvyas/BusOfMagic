import { useState, useEffect } from 'react'
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
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Stack,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Circle as CircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { notificationApi, OnboardingAgingNotification, NotificationSummary } from '@/services/notification.service'

export default function Notifications() {
  const [notifications, setNotifications] = useState<OnboardingAgingNotification[]>([])
  const [summary, setSummary] = useState<NotificationSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [filterColor, setFilterColor] = useState<string | null>(null)

  const fetchNotifications = async () => {
    setLoading(true)
    setError('')
    try {
      const [notifs, sum] = await Promise.all([
        filterColor ? notificationApi.getByColor(filterColor) : notificationApi.getAll(),
        notificationApi.getSummary(),
      ])
      setNotifications(notifs)
      setSummary(sum)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [filterColor])

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      fetchNotifications()
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const handleDismiss = async (id: number) => {
    try {
      await notificationApi.dismiss(id)
      fetchNotifications()
    } catch (err) {
      console.error('Error dismissing notification:', err)
    }
  }

  const handleTriggerCalculation = async () => {
    setLoading(true)
    try {
      await notificationApi.triggerCalculation()
      // Wait a moment for the calculation to complete
      setTimeout(() => fetchNotifications(), 1000)
    } catch (err) {
      console.error('Error triggering calculation:', err)
      setError('Failed to trigger calculation')
      setLoading(false)
    }
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    const colors = [null, 'RED', 'AMBER', 'GREEN']
    setFilterColor(colors[newValue])
  }

  const getColorChip = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      GREEN: { bg: '#4caf50', text: 'white', icon: <CheckCircleIcon fontSize="small" /> },
      AMBER: { bg: '#ff9800', text: 'white', icon: <WarningIcon fontSize="small" /> },
      RED: { bg: '#f44336', text: 'white', icon: <ErrorIcon fontSize="small" /> },
    }
    const config = colorMap[color] || { bg: '#9e9e9e', text: 'white', icon: <CircleIcon fontSize="small" /> }
    
    return (
      <Chip
        icon={config.icon}
        label={color}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.text,
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: config.text },
        }}
      />
    )
  }

  const getStatusChip = (status: string) => {
    const isComplete = status === 'COMPLETE' || status === 'COMPLETED'
    return (
      <Chip
        label={isComplete ? 'Completed' : 'Incomplete'}
        size="small"
        color={isComplete ? 'success' : 'warning'}
        variant="outlined"
      />
    )
  }

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Onboarding Aging Notifications
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh notifications">
            <IconButton onClick={fetchNotifications} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={handleTriggerCalculation}
            disabled={loading}
          >
            Recalculate
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleMarkAllRead}
            disabled={loading || notifications.length === 0}
          >
            Mark All Read
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #2196f3' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Active
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {summary.totalActive}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #f44336' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Critical (5+ days)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error">
                  {summary.byColor?.RED || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #ff9800' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Warning (3 days)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {summary.byColor?.AMBER || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderLeft: '4px solid #4caf50' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Normal (1 day)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {summary.byColor?.GREEN || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`All (${summary?.totalActive || 0})`} />
          <Tab 
            label={`Critical (${summary?.byColor?.RED || 0})`} 
            icon={<CircleIcon sx={{ color: '#f44336', fontSize: 12 }} />}
            iconPosition="start"
          />
          <Tab 
            label={`Warning (${summary?.byColor?.AMBER || 0})`}
            icon={<CircleIcon sx={{ color: '#ff9800', fontSize: 12 }} />}
            iconPosition="start"
          />
          <Tab 
            label={`Normal (${summary?.byColor?.GREEN || 0})`}
            icon={<CircleIcon sx={{ color: '#4caf50', fontSize: 12 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Notifications Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell>Status</TableCell>
              <TableCell>Candidate</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Onboarding</TableCell>
              <TableCell align="center">Days</TableCell>
              <TableCell>Aging</TableCell>
              <TableCell>Message</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No notifications found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow 
                  key={notification.id}
                  sx={{ 
                    backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                    '&:hover': { backgroundColor: 'action.selected' },
                  }}
                >
                  <TableCell>
                    {!notification.isRead && (
                      <Chip label="New" size="small" color="primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={notification.isRead ? 'normal' : 'bold'}>
                      {notification.candidateName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {notification.candidateId}
                    </Typography>
                  </TableCell>
                  <TableCell>{notification.phoneNumber}</TableCell>
                  <TableCell>{getStatusChip(notification.onboardingStatus)}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={`${notification.daysSinceCreated} day(s)`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{getColorChip(notification.agingColor)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 250 }}>
                      {notification.message}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Dismiss">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Aging Level Legend:
        </Typography>
        <Stack direction="row" spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircleIcon sx={{ color: '#4caf50', fontSize: 16 }} />
            <Typography variant="body2">GREEN (1 day) - Recently started/completed</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircleIcon sx={{ color: '#ff9800', fontSize: 16 }} />
            <Typography variant="body2">AMBER (3 days) - Needs attention</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircleIcon sx={{ color: '#f44336', fontSize: 16 }} />
            <Typography variant="body2">RED (5+ days) - Critical, urgent action required</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
