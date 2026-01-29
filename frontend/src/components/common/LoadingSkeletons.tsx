import { Box, Skeleton, Grid, Paper, Card, CardContent } from '@mui/material'

/**
 * Modular Loading Skeletons for various page types
 * Easy to use and disable - just replace with actual content when loaded
 */

// Dashboard loading skeleton
export function DashboardSkeleton() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={60} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

// Table loading skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Paper>
      {/* Table Header */}
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={30} />
        ))}
      </Box>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Box key={rowIdx} sx={{ p: 2, display: 'flex', gap: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} variant="text" width={`${100 / columns}%`} height={24} />
          ))}
        </Box>
      ))}
    </Paper>
  )
}

// Card list loading skeleton
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="90%" />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

// Form loading skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        {Array.from({ length: fields }).map((_, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Skeleton variant="text" width={100} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Paper>
  )
}

// Notification list skeleton
export function NotificationSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <Paper key={i} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Paper>
      ))}
    </Box>
  )
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Skeleton variant="text" width={80} height={60} />
            <Skeleton variant="text" width={120} />
          </Box>
          <Skeleton variant="circular" width={48} height={48} />
        </Box>
      </CardContent>
    </Card>
  )
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={200} height={40} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  )
}
