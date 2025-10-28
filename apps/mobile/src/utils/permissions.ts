import type { UserRole } from '@/constants/userRoles';
export type Permission = 
  | 'view_farms' 
  | 'manage_farms'
  | 'capture_data'
  | 'view_analytics'
  | 'manage_orders'
  | 'view_orders'
  | 'export_data'
  | 'manage_logistics'
  | 'view_suppliers'
  | 'manage_settings';

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'view_farms',
    'manage_farms',
    'capture_data',
    'view_analytics',
    'manage_orders',
    'view_orders',
    'export_data',
    'manage_logistics',
    'view_suppliers',
    'manage_settings'
  ],
  farm: [
    'view_farms',
    'manage_farms',
    'capture_data',
    'view_analytics',
    'manage_orders',
    'view_suppliers',
    'manage_settings'
  ],
  logistics: [
    'capture_data',
    'view_orders',
    'manage_logistics',
    'view_suppliers'
  ],
  exporter: [
    'view_analytics',
    'manage_orders',
    'export_data',
    'view_suppliers',
    'manage_settings'
  ],
  buyer: [
    'view_orders',
    'view_analytics',
    'view_suppliers'
  ]
};

// Check if user role has specific permission
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

// Get all permissions for a role
export const getPermissionsForRole = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] ?? [];
};

// Check multiple permissions at once
export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};