import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { ErrorProvider } from '@context/ErrorContext'
import { AuthProvider } from '@context/AuthContext'
import { AdminAuthProvider } from '@context/AdminAuthContext'
import ErrorNotification from '@components/common/ErrorNotification'
import { ProtectedRoute } from '@components/auth'
import Layout from '@components/layout/Layout'

// Pages
import Dashboard from '@pages/Dashboard'
import Customers from '@pages/Customers'
import Settings from '@pages/Settings'
import Locations from '@pages/Locations'
import IndividualSignup from '@pages/auth/IndividualSignup'
import Login from '@pages/auth/Login'
import Unauthorized from '@pages/auth/Unauthorized'
import Onboarding from '@pages/Onboarding'
import { AdminManagement, RoleManagement, PermissionManagement } from '@pages/admin'
import { UnderScreening, Orientation, Enroll } from '@pages/screening'
import { TrainingMaster, TrainingBatches } from '@pages/training'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorNotification />
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes (without layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/individualsignup" element={<IndividualSignup />} />
                <Route path="/onboard" element={<Onboarding />} />

                {/* Protected Dashboard Routes (with layout) */}
                <Route element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="locations" element={<Locations />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  
                  {/* Screening Routes - State Admin Access */}
                  <Route 
                    path="under-screening" 
                    element={
                      <ProtectedRoute requiredPermission="SCREENING_VIEW">
                        <UnderScreening />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="orientation" 
                    element={
                      <ProtectedRoute requiredPermission="SCREENING_VIEW">
                        <Orientation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="enroll" 
                    element={
                      <ProtectedRoute requiredPermission="SCREENING_MANAGE">
                        <Enroll />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Super Admin Only Routes */}
                  <Route 
                    path="admin-management" 
                    element={
                      <ProtectedRoute requiredPermission="ADMIN_MANAGE">
                        <AdminManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="role-management" 
                    element={
                      <ProtectedRoute requiredPermission="ROLE_MANAGE">
                        <RoleManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="permission-management" 
                    element={
                      <ProtectedRoute requiredPermission="PERMISSION_MANAGE">
                        <PermissionManagement />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Training Management - Super Admin */}
                  <Route 
                    path="training-master" 
                    element={
                      <ProtectedRoute requiredPermission="TRAINING_MANAGE">
                        <TrainingMaster />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="training-batches" 
                    element={
                      <ProtectedRoute requiredPermission="TRAINING_MANAGE">
                        <TrainingBatches />
                      </ProtectedRoute>
                    } 
                  />
                </Route>

                {/* Catch all - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorProvider>
  )
}

export default App
