import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'onboarding' | 'reports' | 'technical'
}

const faqData: FAQItem[] = [
  {
    question: 'How do I add a new candidate?',
    answer: 'Navigate to the Individual Signup page from the login screen, or use the "Under Screening" section to add candidates who come through field mobilization.',
    category: 'onboarding',
  },
  {
    question: 'What do the aging colors (Green/Amber/Red) mean?',
    answer: 'GREEN: Candidate onboarding within 1 day - on track. AMBER: 2-3 days since registration - needs attention. RED: 5+ days - critical, immediate action required to prevent dropout.',
    category: 'onboarding',
  },
  {
    question: 'How does the screening workflow work?',
    answer: 'Candidates flow through: Under Screening → Orientation → Enroll → Enrolled. Each stage requires verification before moving to the next.',
    category: 'onboarding',
  },
  {
    question: 'How do I export data to Excel?',
    answer: 'On any table view, look for the "Export" button in the top-right corner. Click it to download the current data as an Excel file.',
    category: 'reports',
  },
  {
    question: 'What reports are available?',
    answer: 'The Reports section includes: Onboarding Summary, Workflow Status, Location-wise Analysis, Monthly Trends, and Aging Reports.',
    category: 'reports',
  },
  {
    question: 'How do I change my password?',
    answer: 'Go to Settings → Profile → Change Password. You will need to enter your current password and the new password twice for confirmation.',
    category: 'general',
  },
  {
    question: 'What are the different user roles?',
    answer: 'Super Admin: Full access to all features. State Admin: Manages candidates within their assigned state. City Admin: Manages candidates within their assigned city.',
    category: 'general',
  },
  {
    question: 'Why am I seeing "Unauthorized" error?',
    answer: 'This means you don\'t have permission to access that feature. Contact your administrator to request access.',
    category: 'technical',
  },
]

const categoryColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
  general: 'primary',
  onboarding: 'success',
  reports: 'secondary',
  technical: 'warning',
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpIcon color="primary" />
          <Typography variant="h6">Help & FAQ</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {/* Quick Links */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Quick Navigation
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Dashboard" secondary="View overall statistics and trends" />
            </ListItem>
            <ListItem>
              <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Under Screening" secondary="Manage new candidate screenings" />
            </ListItem>
            <ListItem>
              <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Training Calendar" secondary="Schedule and manage training batches" />
            </ListItem>
            <ListItem>
              <ListItemIcon><NotificationsIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Notifications" secondary="View aging alerts and pending actions" />
            </ListItem>
            <ListItem>
              <ListItemIcon><AssessmentIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Reports" secondary="Generate and export reports" />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* FAQ Section */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="General" color="primary" size="small" variant="outlined" />
          <Chip label="Onboarding" color="success" size="small" variant="outlined" />
          <Chip label="Reports" color="secondary" size="small" variant="outlined" />
          <Chip label="Technical" color="warning" size="small" variant="outlined" />
        </Box>

        {faqData.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Chip 
                  label={faq.category} 
                  color={categoryColors[faq.category]} 
                  size="small" 
                  sx={{ minWidth: 80 }}
                />
                <Typography>{faq.question}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Contact Support */}
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Need More Help?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Contact the Magic Bus IT Support team:
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon fontSize="small" color="primary" />
              <Typography variant="body2">support@magicbus.org</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon fontSize="small" color="primary" />
              <Typography variant="body2">+91 1800-XXX-XXXX</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
