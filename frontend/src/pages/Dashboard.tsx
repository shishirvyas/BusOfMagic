import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { LocationCity as LocationIcon } from '@mui/icons-material'
import StatCard from '@components/dashboard/StatCard'
import CustomerTable from '@components/dashboard/CustomerTable'
import TrendChart from '@components/dashboard/TrendChart'

export default function Dashboard() {
  const navigate = useNavigate()
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LocationIcon />}
          onClick={() => navigate('/locations')}
        >
          Manage States & Cities
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Customers" value="1,250" change="+5.2%" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue" value="$45,231" change="+12.5%" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Orders" value="892" change="+2.1%" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Growth" value="23.5%" change="+8.2%" />
        </Grid>
      </Grid>

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <TrendChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sales Trend
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary">Chart placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CustomerTable />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
