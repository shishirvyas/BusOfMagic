import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, useMediaQuery, Box, IconButton, Divider, Tooltip, Avatar, Typography, Button, Collapse, } from '@mui/material';
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
import { menuApi } from '@/services/auth.service';
const DRAWER_WIDTH = 280;
const MINI_DRAWER_WIDTH = 72;
// Icon mapping
const iconMap = {
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
const defaultMenuItems = [
    { id: 1, name: 'dashboard', label: 'Dashboard', icon: 'Dashboard', path: '/dashboard', sortOrder: 1, isActive: true },
];
export default function Sidebar({ open, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isAuthenticated, user, menuItems, logout } = useAdminAuth();
    const [displayMenuItems, setDisplayMenuItems] = useState(defaultMenuItems);
    const [menuGroups, setMenuGroups] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});
    // Update menu items when auth state changes
    useEffect(() => {
        if (isAuthenticated && menuItems.length > 0) {
            setDisplayMenuItems(menuItems);
        }
        else {
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
            const expanded = {};
            groups.forEach(g => { expanded[g.name] = true; });
            setExpandedGroups(expanded);
        }
        catch (err) {
            console.error('Failed to load grouped menu:', err);
        }
    };
    const handleGroupToggle = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };
    const handleNavigate = (path) => {
        navigate(path);
        if (isMobile) {
            onClose();
        }
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const getIcon = (iconName) => {
        const IconComponent = iconMap[iconName] || DashboardIcon;
        return _jsx(IconComponent, {});
    };
    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };
    // Full drawer content (for mobile and expanded desktop)
    const fullDrawer = (_jsxs(Box, { sx: {
            height: '100%',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
        }, children: [_jsxs(Box, { sx: { p: 2 }, children: [isMobile && (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { display: 'flex', justifyContent: 'flex-end', mb: 1 }, children: _jsx(IconButton, { onClick: onClose, "aria-label": "close menu", children: _jsx(CloseIcon, {}) }) }), _jsx(Divider, { sx: { mb: 2 } })] })), _jsx(Box, { sx: { textAlign: 'center', mb: 2 }, children: _jsx("img", { src: "/assets/magic-bus-logo.png", alt: "Magic Bus Logo", style: { height: '50px', width: 'auto', objectFit: 'contain' } }) }), isAuthenticated && user && (_jsxs(Box, { sx: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                            mb: 2,
                        }, children: [_jsx(Avatar, { sx: { bgcolor: 'primary.main', width: 40, height: 40 }, children: user.firstName?.[0] || user.username[0].toUpperCase() }), _jsxs(Box, { sx: { overflow: 'hidden' }, children: [_jsxs(Typography, { variant: "subtitle2", noWrap: true, children: [user.firstName, " ", user.lastName] }), _jsx(Typography, { variant: "caption", color: "text.secondary", noWrap: true, children: user.roleName.replace('_', ' ') })] })] }))] }), _jsx(Divider, {}), _jsx(List, { sx: { flex: 1, px: 1, py: 2 }, children: menuGroups.length > 0 ? (
                // Render grouped menu
                menuGroups.map((group) => (_jsxs(Box, { children: [_jsxs(ListItemButton, { onClick: () => handleGroupToggle(group.name), sx: {
                                borderRadius: 1,
                                mb: 0.5,
                                py: 0.5,
                            }, children: [_jsx(ListItemIcon, { sx: { minWidth: 36 }, children: getIcon(group.icon) }), _jsx(ListItemText, { primary: group.label, primaryTypographyProps: {
                                        variant: 'subtitle2',
                                        fontWeight: 'bold',
                                        color: 'text.secondary',
                                    } }), expandedGroups[group.name] ? _jsx(ExpandLess, {}) : _jsx(ExpandMore, {})] }), _jsx(Collapse, { in: expandedGroups[group.name], timeout: "auto", unmountOnExit: true, children: _jsx(List, { component: "div", disablePadding: true, children: group.menuItems.map((item) => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { onClick: () => handleNavigate(item.path), selected: isActiveRoute(item.path), sx: {
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
                                        }, children: [_jsx(ListItemIcon, { sx: { minWidth: 36 }, children: getIcon(item.icon) }), _jsx(ListItemText, { primary: item.label })] }) }, item.id))) }) }), _jsx(Divider, { sx: { my: 1 } })] }, group.id)))) : (
                // Fallback to flat menu
                displayMenuItems.map((item) => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { onClick: () => handleNavigate(item.path), selected: isActiveRoute(item.path), sx: {
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
                        }, children: [_jsx(ListItemIcon, { children: getIcon(item.icon) }), _jsx(ListItemText, { primary: item.label })] }) }, item.id)))) }), isAuthenticated && (_jsxs(Box, { sx: { p: 2 }, children: [_jsx(Divider, { sx: { mb: 2 } }), _jsx(Button, { fullWidth: true, variant: "outlined", color: "error", startIcon: _jsx(LogoutIcon, {}), onClick: handleLogout, children: "Logout" })] }))] }));
    // Mini drawer content (icons only for collapsed desktop)
    const miniDrawer = (_jsxs(Box, { sx: {
            height: '100%',
            backgroundColor: 'background.paper',
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }, children: [_jsx(Box, { sx: { mb: 3 }, children: _jsx("img", { src: "/assets/magic-bus-logo.png", alt: "Magic Bus Logo", style: { height: '32px', width: 'auto', objectFit: 'contain' } }) }), isAuthenticated && user && (_jsx(Tooltip, { title: `${user.firstName} ${user.lastName}`, placement: "right", children: _jsx(Avatar, { sx: { bgcolor: 'primary.main', width: 36, height: 36, mb: 2 }, children: user.firstName?.[0] || user.username[0].toUpperCase() }) })), _jsx(Divider, { sx: { width: '80%', mb: 2 } }), _jsx(List, { sx: { width: '100%', flex: 1 }, children: displayMenuItems.map((item) => (_jsx(ListItem, { disablePadding: true, sx: { justifyContent: 'center' }, children: _jsx(Tooltip, { title: item.label, placement: "right", arrow: true, children: _jsx(ListItemButton, { onClick: () => handleNavigate(item.path), selected: isActiveRoute(item.path), sx: {
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
                            }, children: _jsx(ListItemIcon, { sx: { minWidth: 'auto' }, children: getIcon(item.icon) }) }) }) }, item.id))) }), isAuthenticated && (_jsx(Tooltip, { title: "Logout", placement: "right", children: _jsx(IconButton, { color: "error", onClick: handleLogout, sx: { mb: 2 }, children: _jsx(LogoutIcon, {}) }) }))] }));
    // Mobile: Slide-in drawer overlay
    if (isMobile) {
        return (_jsx(Drawer, { anchor: "left", open: open, onClose: onClose, sx: {
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                },
            }, children: fullDrawer }));
    }
    // Desktop: Full sidebar when open, mini sidebar when collapsed
    return (_jsx(Drawer, { variant: "permanent", sx: {
            width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
                width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
                boxSizing: 'border-box',
                transition: 'width 0.3s ease',
                overflowX: 'hidden',
            },
        }, children: open ? fullDrawer : miniDrawer }));
}
