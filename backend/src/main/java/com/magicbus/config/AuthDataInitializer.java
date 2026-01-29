package com.magicbus.config;

import com.magicbus.entity.auth.AdminUser;
import com.magicbus.entity.auth.Permission;
import com.magicbus.entity.auth.Role;
import com.magicbus.entity.menu.MenuGroup;
import com.magicbus.entity.menu.MenuItem;
import com.magicbus.repository.auth.AdminUserRepository;
import com.magicbus.repository.auth.PermissionRepository;
import com.magicbus.repository.auth.RoleRepository;
import com.magicbus.repository.menu.MenuGroupRepository;
import com.magicbus.repository.menu.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class AuthDataInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final AdminUserRepository adminUserRepository;
    private final MenuItemRepository menuItemRepository;
    private final MenuGroupRepository menuGroupRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing Auth System Data...");
        
        // Initialize permissions
        Map<String, Permission> permissions = initializePermissions();
        
        // Initialize roles with permissions
        Map<String, Role> roles = initializeRoles(permissions);
        
        // Initialize Super Admin user
        initializeSuperAdmin(roles.get("SUPER_ADMIN"));
        
        // Initialize menu groups and items
        Map<String, MenuGroup> menuGroups = initializeMenuGroups();
        initializeMenuItems(permissions, menuGroups);
        
        log.info("Auth System Data initialization complete!");
    }

    private Map<String, Permission> initializePermissions() {
        Map<String, Permission> permissionMap = new HashMap<>();
        
        List<Permission> permissionsToCreate = Arrays.asList(
            createPermission("DASHBOARD_VIEW", "View Dashboard", "View main dashboard", "DASHBOARD"),
            createPermission("ADMIN_MANAGE", "Manage Admins", "Create, update, delete admin users", "ADMIN"),
            createPermission("ADMIN_VIEW", "View Admins", "View admin users", "ADMIN"),
            createPermission("ROLE_VIEW", "View Roles", "View roles list", "ADMIN"),
            createPermission("ROLE_MANAGE", "Manage Roles", "Create, update, delete roles", "ADMIN"),
            createPermission("PERMISSION_VIEW", "View Permissions", "View permissions list", "ADMIN"),
            createPermission("PERMISSION_MANAGE", "Manage Permissions", "Assign permissions to roles", "ADMIN"),
            createPermission("CUSTOMER_VIEW", "View Customers", "View customer list", "CUSTOMER"),
            createPermission("CUSTOMER_MANAGE", "Manage Customers", "Create, update, delete customers", "CUSTOMER"),
            createPermission("LOCATION_VIEW", "View Locations", "View states and cities", "LOCATION"),
            createPermission("LOCATION_MANAGE", "Manage Locations", "Create, update, delete locations", "LOCATION"),
            createPermission("SETTINGS_VIEW", "View Settings", "View application settings", "SETTINGS"),
            createPermission("SETTINGS_MANAGE", "Manage Settings", "Update application settings", "SETTINGS"),
            createPermission("REPORT_VIEW", "View Reports", "View reports", "REPORT"),
            createPermission("REPORT_EXPORT", "Export Reports", "Export reports to CSV/Excel", "REPORT"),
            createPermission("ONBOARDING_VIEW", "View Onboarding", "View onboarding data", "ONBOARDING"),
            createPermission("ONBOARDING_MANAGE", "Manage Onboarding", "Manage onboarding workflow", "ONBOARDING"),
            createPermission("SCREENING_VIEW", "View Screening", "View screening candidates", "SCREENING"),
            createPermission("SCREENING_MANAGE", "Manage Screening", "Manage screening workflow", "SCREENING"),
            createPermission("TRAINING_VIEW", "View Training", "View training programs", "TRAINING"),
            createPermission("TRAINING_MANAGE", "Manage Training", "Manage training programs and batches", "TRAINING"),
            createPermission("NOTIFICATION_VIEW", "View Notifications", "View onboarding aging notifications", "NOTIFICATION")
        );

        for (Permission permission : permissionsToCreate) {
            Permission existing = permissionRepository.findByCode(permission.getCode()).orElse(null);
            if (existing == null) {
                existing = permissionRepository.save(permission);
                log.info("Created permission: {}", permission.getCode());
            }
            permissionMap.put(existing.getCode(), existing);
        }
        
        return permissionMap;
    }

    private Permission createPermission(String code, String name, String description, String module) {
        return Permission.builder()
            .code(code)
            .name(name)
            .description(description)
            .module(module)
            .isActive(true)
            .build();
    }

    private Map<String, Role> initializeRoles(Map<String, Permission> permissions) {
        Map<String, Role> roleMap = new HashMap<>();
        
        // Super Admin - all permissions
        roleMap.put("SUPER_ADMIN", createOrUpdateRole("SUPER_ADMIN", 
            "Super Administrator with full system access",
            new HashSet<>(permissions.values())));
        
        // State Admin permissions
        Set<Permission> stateAdminPerms = new HashSet<>();
        stateAdminPerms.add(permissions.get("DASHBOARD_VIEW"));
        stateAdminPerms.add(permissions.get("CUSTOMER_VIEW"));
        stateAdminPerms.add(permissions.get("CUSTOMER_MANAGE"));
        stateAdminPerms.add(permissions.get("LOCATION_VIEW"));
        stateAdminPerms.add(permissions.get("REPORT_VIEW"));
        stateAdminPerms.add(permissions.get("REPORT_EXPORT"));
        stateAdminPerms.add(permissions.get("ONBOARDING_VIEW"));
        stateAdminPerms.add(permissions.get("ONBOARDING_MANAGE"));
        stateAdminPerms.add(permissions.get("SCREENING_VIEW"));
        stateAdminPerms.add(permissions.get("SCREENING_MANAGE"));
        stateAdminPerms.add(permissions.get("ADMIN_VIEW"));
        stateAdminPerms.add(permissions.get("NOTIFICATION_VIEW"));
        roleMap.put("STATE_ADMIN", createOrUpdateRole("STATE_ADMIN", 
            "State level administrator", stateAdminPerms));
        
        // City Admin permissions
        Set<Permission> cityAdminPerms = new HashSet<>();
        cityAdminPerms.add(permissions.get("DASHBOARD_VIEW"));
        cityAdminPerms.add(permissions.get("CUSTOMER_VIEW"));
        cityAdminPerms.add(permissions.get("CUSTOMER_MANAGE"));
        cityAdminPerms.add(permissions.get("LOCATION_VIEW"));
        cityAdminPerms.add(permissions.get("REPORT_VIEW"));
        cityAdminPerms.add(permissions.get("ONBOARDING_VIEW"));
        cityAdminPerms.add(permissions.get("ONBOARDING_MANAGE"));
        cityAdminPerms.add(permissions.get("NOTIFICATION_VIEW"));
        roleMap.put("CITY_ADMIN", createOrUpdateRole("CITY_ADMIN", 
            "City level administrator", cityAdminPerms));
        
        // Viewer permissions
        Set<Permission> viewerPerms = new HashSet<>();
        viewerPerms.add(permissions.get("DASHBOARD_VIEW"));
        viewerPerms.add(permissions.get("CUSTOMER_VIEW"));
        viewerPerms.add(permissions.get("LOCATION_VIEW"));
        viewerPerms.add(permissions.get("REPORT_VIEW"));
        roleMap.put("VIEWER", createOrUpdateRole("VIEWER", 
            "Read-only access", viewerPerms));
        
        return roleMap;
    }

    private Role createOrUpdateRole(String name, String description, Set<Permission> permissions) {
        Role role = roleRepository.findByName(name).orElse(null);
        if (role == null) {
            role = Role.builder()
                .name(name)
                .description(description)
                .permissions(permissions)
                .isActive(true)
                .build();
            role = roleRepository.save(role);
            log.info("Created role: {}", name);
        } else {
            role.setDescription(description);
            role.setPermissions(permissions);
            role = roleRepository.save(role);
            log.info("Updated role: {}", name);
        }
        return role;
    }

    private void initializeSuperAdmin(Role superAdminRole) {
        if (!adminUserRepository.existsByUsername("superadmin")) {
            AdminUser superAdmin = AdminUser.builder()
                .username("superadmin")
                .password("admin123") // Plain text as requested
                .firstName("Super")
                .lastName("Admin")
                .email("superadmin@magicbus.com")
                .role(superAdminRole)
                .isActive(true)
                .build();
            adminUserRepository.save(superAdmin);
            log.info("Created Super Admin user: superadmin/admin123");
        } else {
            log.info("Super Admin user already exists");
        }
    }

    private Map<String, MenuGroup> initializeMenuGroups() {
        Map<String, MenuGroup> groupMap = new HashMap<>();
        
        List<MenuGroup> groupsToCreate = Arrays.asList(
            createMenuGroup("main", "Main", "Home", 1),
            createMenuGroup("administration", "Administration", "AdminPanelSettings", 2),
            createMenuGroup("screening", "Screening", "FilterList", 3),
            createMenuGroup("operations", "Operations", "Business", 4),
            createMenuGroup("system", "System", "Settings", 5)
        );
        
        for (MenuGroup group : groupsToCreate) {
            MenuGroup existing = menuGroupRepository.findByName(group.getName()).orElse(null);
            if (existing == null) {
                existing = menuGroupRepository.save(group);
                log.info("Created menu group: {}", group.getName());
            }
            groupMap.put(existing.getName(), existing);
        }
        
        return groupMap;
    }

    private MenuGroup createMenuGroup(String name, String label, String icon, int sortOrder) {
        return MenuGroup.builder()
            .name(name)
            .label(label)
            .icon(icon)
            .sortOrder(sortOrder)
            .isActive(true)
            .build();
    }

    private void initializeMenuItems(Map<String, Permission> permissions, Map<String, MenuGroup> menuGroups) {
        // Clear existing menu items to recreate with groups
        if (menuItemRepository.count() > 0) {
            log.info("Menu items already exist, checking for updates...");
        }
        
        // Create menu items organized by groups
        List<MenuItem> menuItems = Arrays.asList(
            // Main Group
            createMenuItem("dashboard", "Dashboard", "Dashboard", "/dashboard", 1, 
                permissions.get("DASHBOARD_VIEW"), menuGroups.get("main")),
            createMenuItem("notifications", "Notifications", "Notifications", "/notifications", 2, 
                permissions.get("NOTIFICATION_VIEW"), menuGroups.get("main")),
            
            // Administration Group
            createMenuItem("admin-management", "User Management", "People", "/admin-management", 1, 
                permissions.get("ADMIN_MANAGE"), menuGroups.get("administration")),
            createMenuItem("role-management", "Role Management", "Security", "/role-management", 2, 
                permissions.get("ROLE_MANAGE"), menuGroups.get("administration")),
            createMenuItem("permission-management", "Permissions", "Key", "/permission-management", 3, 
                permissions.get("PERMISSION_MANAGE"), menuGroups.get("administration")),
            
            // Screening Group
            createMenuItem("under-screening", "Under Screening", "HourglassEmpty", "/under-screening", 1, 
                permissions.get("SCREENING_VIEW"), menuGroups.get("screening")),
            createMenuItem("orientation", "Orientation", "School", "/orientation", 2, 
                permissions.get("SCREENING_VIEW"), menuGroups.get("screening")),
            createMenuItem("enroll", "Enroll", "HowToReg", "/enroll", 3, 
                permissions.get("SCREENING_MANAGE"), menuGroups.get("screening")),
            
            // Operations Group
            createMenuItem("customers", "Customers", "People", "/customers", 1, 
                permissions.get("CUSTOMER_VIEW"), menuGroups.get("operations")),
            createMenuItem("locations", "Locations", "LocationCity", "/locations", 2, 
                permissions.get("LOCATION_VIEW"), menuGroups.get("operations")),
            createMenuItem("reports", "Reports", "Assessment", "/reports", 3, 
                permissions.get("REPORT_VIEW"), menuGroups.get("operations")),
            
            // System Group
            createMenuItem("training-master", "Training Master", "School", "/training-master", 1, 
                permissions.get("TRAINING_MANAGE"), menuGroups.get("system")),
            createMenuItem("training-batches", "Training Batches", "EventNote", "/training-batches", 2, 
                permissions.get("TRAINING_MANAGE"), menuGroups.get("system")),
            createMenuItem("training-calendar", "Training Calendar", "CalendarMonth", "/training-calendar", 3, 
                permissions.get("TRAINING_MANAGE"), menuGroups.get("system")),
            createMenuItem("settings", "Settings", "Settings", "/settings", 4, 
                permissions.get("SETTINGS_VIEW"), menuGroups.get("system"))
        );
        
        for (MenuItem item : menuItems) {
            MenuItem existing = menuItemRepository.findByName(item.getName()).orElse(null);
            if (existing == null) {
                menuItemRepository.save(item);
                log.info("Created menu item: {}", item.getName());
            } else {
                existing.setLabel(item.getLabel());
                existing.setIcon(item.getIcon());
                existing.setPath(item.getPath());
                existing.setSortOrder(item.getSortOrder());
                existing.setRequiredPermission(item.getRequiredPermission());
                existing.setMenuGroup(item.getMenuGroup());
                menuItemRepository.save(existing);
                log.info("Updated menu item: {}", item.getName());
            }
        }
    }

    private MenuItem createMenuItem(String name, String label, String icon, String path, 
            int sortOrder, Permission permission, MenuGroup menuGroup) {
        return MenuItem.builder()
            .name(name)
            .label(label)
            .icon(icon)
            .path(path)
            .sortOrder(sortOrder)
            .requiredPermission(permission)
            .menuGroup(menuGroup)
            .isActive(true)
            .build();
    }
}
