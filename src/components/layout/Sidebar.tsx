import { useEffect, useState } from 'react';
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
  IconButton,
  Divider,
  Tooltip,
  Avatar,
  Typography,
  Button,
  Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Import all possible icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { useAdminAuth } from '@/context/AdminAuthContext';
import { MenuItem, MenuGroup } from '@/types/auth.types';
import { menuApi } from '@/services/auth.service';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 280;
const MINI_DRAWER_WIDTH = 72;

// Icon mapping
const iconMap: Record<string, React.ComponentType> = {
  Dashboard: DashboardIcon,
  People: PeopleIcon,
  Settings: SettingsIcon,
  LocationCity: LocationCityIcon,
  AdminPanelSettings: AdminPanelSettingsIcon,
  Assessment: AssessmentIcon,
  Person: PersonIcon,
  Home: HomeIcon,
  Business: BusinessIcon,
  Security: SecurityIcon,
  Key: KeyIcon,
  Assignment: AssignmentIcon,
  MoreHoriz: MoreHorizIcon,
};

// Default menu items (fallback when not authenticated or API fails)
const defaultMenuItems: MenuItem[] = [
  { id: 1, name: 'dashboard', label: 'Dashboard', icon: 'Dashboard', path: '/dashboard', sortOrder: 1, isActive: true },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated, user, menuItems, logout } = useAdminAuth();
  const [displayMenuItems, setDisplayMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Update menu items when auth state changes
  useEffect(() => {
    if (isAuthenticated && menuItems.length > 0) {
      setDisplayMenuItems(menuItems);
    } else {
      setDisplayMenuItems(defaultMenuItems);
    }
  }, [isAuthenticated, menuItems]);

  // Load grouped menu when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadGroupedMenu();
    }
  }, [isAuthenticated]);

  const loadGroupedMenu = async () => {
    try {
      const groups = await menuApi.getGroupedMenu();
      setMenuGroups(groups);
      // Expand all groups by default
      const expanded: Record<string, boolean> = {};
      groups.forEach(g => { expanded[g.name] = true; });
      setExpandedGroups(expanded);
    } catch (err) {
      console.error('Failed to load grouped menu:', err);
    }
  };

  const handleGroupToggle = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || DashboardIcon;
    return <IconComponent />;
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Full drawer content (for mobile and expanded desktop)
  const fullDrawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        {/* Close button for mobile */}
        {isMobile && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton onClick={onClose} aria-label="close menu">
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </>
        )}
        
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img 
            src="/assets/magic-bus-logo.png" 
            alt="Magic Bus Logo" 
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
          />
        </Box>

        {/* User Info */}
        {isAuthenticated && user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              {user.firstName?.[0] || user.username[0].toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.roleName.replace('_', ' ')}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      
      <Divider />

      {/* Menu Items - Grouped */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuGroups.length > 0 ? (
          // Render grouped menu
          menuGroups.map((group) => (
            <Box key={group.id}>
              {/* Group Header */}
              <ListItemButton 
                onClick={() => handleGroupToggle(group.name)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  py: 0.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {getIcon(group.icon)}
                </ListItemIcon>
                <ListItemText 
                  primary={group.label} 
                  primaryTypographyProps={{ 
                    variant: 'subtitle2',
                    fontWeight: 'bold',
                    color: 'text.secondary',
                  }}
                />
                {expandedGroups[group.name] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              {/* Group Items */}
              <Collapse in={expandedGroups[group.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton 
                        onClick={() => handleNavigate(item.path)}
                        selected={isActiveRoute(item.path)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          pl: 4,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'primary.contrastText',
                            },
                          },
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getIcon(item.icon)}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              
              <Divider sx={{ my: 1 }} />
            </Box>
          ))
        ) : (
          // Fallback to flat menu
          displayMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton 
                onClick={() => handleNavigate(item.path)}
                selected={isActiveRoute(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  {getIcon(item.icon)}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>

      {/* Logout Button */}
      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  // Mini drawer content (icons only for collapsed desktop)
  const miniDrawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Mini Logo */}
      <Box sx={{ mb: 3 }}>
        <img 
          src="/assets/magic-bus-logo.png" 
          alt="Magic Bus Logo" 
          style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
        />
      </Box>
      
      {/* User Avatar */}
      {isAuthenticated && user && (
        <Tooltip title={`${user.firstName} ${user.lastName}`} placement="right">
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, mb: 2 }}>
            {user.firstName?.[0] || user.username[0].toUpperCase()}
          </Avatar>
        </Tooltip>
      )}

      <Divider sx={{ width: '80%', mb: 2 }} />
      
      {/* Menu Icons */}
      <List sx={{ width: '100%', flex: 1 }}>
        {displayMenuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ justifyContent: 'center' }}>
            <Tooltip title={item.label} placement="right" arrow>
              <ListItemButton 
                onClick={() => handleNavigate(item.path)}
                selected={isActiveRoute(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  mx: 1,
                  justifyContent: 'center',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  {getIcon(item.icon)}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Logout Icon */}
      {isAuthenticated && (
        <Tooltip title="Logout" placement="right">
          <IconButton color="error" onClick={handleLogout} sx={{ mb: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  // Mobile: Slide-in drawer overlay
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
        {fullDrawer}
      </Drawer>
    );
  }

  // Desktop: Full sidebar when open, mini sidebar when collapsed
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {open ? fullDrawer : miniDrawer}
    </Drawer>
  );
}
