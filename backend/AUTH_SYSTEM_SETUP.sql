-- =====================================================
-- AUTH & MENU SYSTEM SETUP
-- Run this after the main database setup
-- =====================================================

-- =====================================================
-- PERMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    module VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ROLE_PERMISSIONS JOIN TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- =====================================================
-- ADMIN_USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(20),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    state_id BIGINT REFERENCES state(id),
    city_id BIGINT REFERENCES city(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_by BIGINT REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MENU_ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    path VARCHAR(200) NOT NULL,
    parent_id BIGINT REFERENCES menu_items(id),
    sort_order INTEGER DEFAULT 0,
    permission_id BIGINT REFERENCES permissions(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSERT PERMISSIONS
-- =====================================================
INSERT INTO permissions (name, code, description, module) VALUES
-- Dashboard
('View Dashboard', 'DASHBOARD_VIEW', 'View main dashboard', 'DASHBOARD'),

-- Admin Management (Super Admin only)
('Manage Admins', 'ADMIN_MANAGE', 'Create, update, delete admin users', 'ADMIN'),
('View Admins', 'ADMIN_VIEW', 'View admin users', 'ADMIN'),

-- Customer Management
('View Customers', 'CUSTOMER_VIEW', 'View customer list', 'CUSTOMER'),
('Manage Customers', 'CUSTOMER_MANAGE', 'Create, update, delete customers', 'CUSTOMER'),

-- Location Management
('View Locations', 'LOCATION_VIEW', 'View states and cities', 'LOCATION'),
('Manage Locations', 'LOCATION_MANAGE', 'Create, update, delete states and cities', 'LOCATION'),

-- Settings
('View Settings', 'SETTINGS_VIEW', 'View application settings', 'SETTINGS'),
('Manage Settings', 'SETTINGS_MANAGE', 'Update application settings', 'SETTINGS'),

-- Reports
('View Reports', 'REPORT_VIEW', 'View reports', 'REPORT'),
('Export Reports', 'REPORT_EXPORT', 'Export reports to CSV/Excel', 'REPORT'),

-- Onboarding
('View Onboarding', 'ONBOARDING_VIEW', 'View onboarding data', 'ONBOARDING'),
('Manage Onboarding', 'ONBOARDING_MANAGE', 'Manage onboarding workflow', 'ONBOARDING')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- INSERT ROLES
-- =====================================================
INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN', 'Super Administrator with full system access'),
('STATE_ADMIN', 'State level administrator'),
('CITY_ADMIN', 'City level administrator'),
('VIEWER', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ASSIGN PERMISSIONS TO ROLES
-- =====================================================

-- Super Admin gets ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- State Admin permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'STATE_ADMIN' 
AND p.code IN (
    'DASHBOARD_VIEW', 
    'CUSTOMER_VIEW', 'CUSTOMER_MANAGE',
    'LOCATION_VIEW',
    'REPORT_VIEW', 'REPORT_EXPORT',
    'ONBOARDING_VIEW', 'ONBOARDING_MANAGE',
    'ADMIN_VIEW'
)
ON CONFLICT DO NOTHING;

-- City Admin permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'CITY_ADMIN' 
AND p.code IN (
    'DASHBOARD_VIEW', 
    'CUSTOMER_VIEW', 'CUSTOMER_MANAGE',
    'LOCATION_VIEW',
    'REPORT_VIEW',
    'ONBOARDING_VIEW', 'ONBOARDING_MANAGE'
)
ON CONFLICT DO NOTHING;

-- Viewer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'VIEWER' 
AND p.code IN (
    'DASHBOARD_VIEW', 
    'CUSTOMER_VIEW',
    'LOCATION_VIEW',
    'REPORT_VIEW'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- INSERT MENU ITEMS
-- =====================================================
INSERT INTO menu_items (name, label, icon, path, sort_order, permission_id) VALUES
('dashboard', 'Dashboard', 'Dashboard', '/dashboard', 1, 
    (SELECT id FROM permissions WHERE code = 'DASHBOARD_VIEW')),
('admin-management', 'Admin Management', 'AdminPanelSettings', '/admin-management', 2, 
    (SELECT id FROM permissions WHERE code = 'ADMIN_MANAGE')),
('customers', 'Customers', 'People', '/customers', 3, 
    (SELECT id FROM permissions WHERE code = 'CUSTOMER_VIEW')),
('locations', 'Locations', 'LocationCity', '/locations', 4, 
    (SELECT id FROM permissions WHERE code = 'LOCATION_VIEW')),
('reports', 'Reports', 'Assessment', '/reports', 5, 
    (SELECT id FROM permissions WHERE code = 'REPORT_VIEW')),
('settings', 'Settings', 'Settings', '/settings', 6, 
    (SELECT id FROM permissions WHERE code = 'SETTINGS_VIEW'))
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE SUPER ADMIN USER
-- Username: superadmin
-- Password: admin123 (plain text as requested)
-- =====================================================
INSERT INTO admin_users (username, password, first_name, last_name, email, role_id, is_active)
SELECT 'superadmin', 'admin123', 'Super', 'Admin', 'superadmin@magicbus.com', r.id, true
FROM roles r 
WHERE r.name = 'SUPER_ADMIN'
AND NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'superadmin');

-- =====================================================
-- CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_state_id ON admin_users(state_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_city_id ON admin_users(city_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON menu_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_permissions_code ON permissions(code);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Check roles created
SELECT 'Roles:' as info;
SELECT id, name, description FROM roles;

-- Check permissions created
SELECT 'Permissions:' as info;
SELECT id, code, name, module FROM permissions;

-- Check Super Admin created
SELECT 'Super Admin User:' as info;
SELECT au.id, au.username, au.first_name, au.last_name, r.name as role 
FROM admin_users au 
JOIN roles r ON au.role_id = r.id 
WHERE au.username = 'superadmin';

-- Check menu items
SELECT 'Menu Items:' as info;
SELECT id, name, label, icon, path, sort_order FROM menu_items ORDER BY sort_order;

SELECT 'AUTH SYSTEM SETUP COMPLETE!' as status;
