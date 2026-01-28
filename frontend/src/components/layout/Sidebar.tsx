import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const DRAWER_WIDTH = 280

const menuItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { label: 'Customers', icon: PeopleIcon, path: '/customers' },
  { label: 'Settings', icon: SettingsIcon, path: '/settings' },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleNavigate = (path: string) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  const drawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        p: 2,
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  )
}
