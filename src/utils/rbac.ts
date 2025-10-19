/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Implements least-privilege access control for CRM features
 * Reference: OWASP - Centralize authorization checks, default deny
 * 
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
 */

// Permission definitions
export type Permission =
  | 'lead.timeline:read'
  | 'lead.timeline:write'
  | 'lead:read'
  | 'lead:write'
  | 'lead:delete'
  | 'deal:read'
  | 'deal:write'
  | 'deal:delete'
  | 'contact:read'
  | 'contact:write'
  | 'admin:users'
  | 'admin:roles'
  | 'admin:settings';

// Role definitions
export type Role = 'SDR' | 'AE' | 'Manager' | 'Marketing' | 'Support' | 'Admin';

// Role → Permissions mapping
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SDR: [
    'lead:read',
    'lead:write',
    'lead.timeline:read',
    'lead.timeline:write',
    'contact:read',
  ],
  AE: [
    'lead:read',
    'lead:write',
    'lead.timeline:read',
    'lead.timeline:write',
    'deal:read',
    'deal:write',
    'contact:read',
    'contact:write',
  ],
  Manager: [
    'lead:read',
    'lead:write',
    'lead:delete',
    'lead.timeline:read',
    'lead.timeline:write',
    'deal:read',
    'deal:write',
    'deal:delete',
    'contact:read',
    'contact:write',
  ],
  Marketing: [
    'lead:read',
    'lead:write',
    'contact:read',
  ],
  Support: [
    'lead:read',
    'contact:read',
  ],
  Admin: [
    'lead:read',
    'lead:write',
    'lead:delete',
    'lead.timeline:read',
    'lead.timeline:write',
    'deal:read',
    'deal:write',
    'deal:delete',
    'contact:read',
    'contact:write',
    'admin:users',
    'admin:roles',
    'admin:settings',
  ],
};

/**
 * Check if a user has a specific permission
 * @param userRole - User's role
 * @param permission - Permission to check
 * @returns true if user has permission
 */
export function can(userRole: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

/**
 * Check if user can view timeline/interactions
 * @param userRole - User's role
 * @returns true if user can view timeline
 */
export function canViewTimeline(userRole: Role): boolean {
  return can(userRole, 'lead.timeline:read');
}

/**
 * Check if user can log activities
 * @param userRole - User's role
 * @returns true if user can log activities
 */
export function canLogActivity(userRole: Role): boolean {
  return can(userRole, 'lead.timeline:write');
}

/**
 * Get all permissions for a role
 * @param role - Role to get permissions for
 * @returns Array of permissions
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check multiple permissions (user must have ALL)
 * @param userRole - User's role
 * @param permissions - Permissions to check
 * @returns true if user has all permissions
 */
export function canAll(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(perm => can(userRole, perm));
}

/**
 * Check multiple permissions (user must have ANY)
 * @param userRole - User's role
 * @param permissions - Permissions to check
 * @returns true if user has any permission
 */
export function canAny(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(perm => can(userRole, perm));
}

/**
 * Mock user context (replace with actual auth context)
 */
export interface UserContext {
  id: string;
  role: Role;
  email: string;
}

// For demo purposes - in production, get from auth context
export const MOCK_USER: UserContext = {
  id: 'user-1',
  role: 'AE',
  email: 'demo@example.com',
};

