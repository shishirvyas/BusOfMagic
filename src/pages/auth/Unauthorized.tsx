import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Block as BlockIcon } from '@mui/icons-material';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ef5350 0%, #f44336 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You don't have permission to access this page.
            Please contact your administrator if you believe this is an error.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
