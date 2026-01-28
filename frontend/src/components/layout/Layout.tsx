import { Box, AppBar, Toolbar, Typography, Container, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Magic Bus Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Container maxWidth="lg">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
