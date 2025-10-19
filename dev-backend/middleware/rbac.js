/**
 * RBAC Middleware for Express
 * 
 * Implements centralized authorization checks
 * Reference: OWASP Authorization Cheat Sheet
 * 
 * Database schema (PostgreSQL):
 * 
 * CREATE TABLE roles (
 *   id SERIAL PRIMARY KEY,
 *   name TEXT UNIQUE NOT NULL
 * );
 * 
 * CREATE TABLE permissions (
 *   id SERIAL PRIMARY KEY,
 *   name TEXT UNIQUE NOT NULL
 * );
 * 
 * CREATE TABLE role_permissions (
 *   role_id INT REFERENCES roles(id),
 *   perm_id INT REFERENCES permissions(id),
 *   PRIMARY KEY(role_id, perm_id)
 * );
 * 
 * CREATE TABLE user_roles (
 *   user_id UUID REFERENCES users(id),
 *   role_id INT REFERENCES roles(id),
 *   PRIMARY KEY(user_id, role_id)
 * );
 * 
 * -- Optional: per-record access control
 * CREATE TABLE acl_grants (
 *   id SERIAL PRIMARY KEY,
 *   subject_type TEXT NOT NULL, -- 'user' | 'role'
 *   subject_id TEXT NOT NULL,
 *   resource TEXT NOT NULL, -- 'lead:123'
 *   action TEXT NOT NULL, -- 'read' | 'write' | 'delete'
 *   effect TEXT NOT NULL DEFAULT 'allow' -- 'allow' | 'deny'
 * );
 * 
 * CREATE INDEX idx_acl_subject ON acl_grants(subject_type, subject_id);
 * CREATE INDEX idx_acl_resource ON acl_grants(resource);
 */

// Mock permission check (replace with actual DB queries)
const ROLE_PERMISSIONS = {
  SDR: ['lead:read', 'lead:write', 'lead.timeline:read', 'lead.timeline:write'],
  AE: ['lead:read', 'lead:write', 'lead.timeline:read', 'lead.timeline:write', 'deal:read', 'deal:write'],
  Manager: ['lead:read', 'lead:write', 'lead:delete', 'lead.timeline:read', 'lead.timeline:write', 'deal:read', 'deal:write', 'deal:delete'],
  Marketing: ['lead:read', 'lead:write'],
  Support: ['lead:read'],
  Admin: ['*'], // All permissions
};

/**
 * Check if user has permission
 * @param {string} userId - User ID
 * @param {string} permission - Permission to check
 * @returns {Promise<boolean>}
 */
async function can(userId, permission) {
  // In production: query database
  // SELECT p.name FROM permissions p
  // JOIN role_permissions rp ON p.id = rp.perm_id
  // JOIN user_roles ur ON rp.role_id = ur.role_id
  // WHERE ur.user_id = $1 AND p.name = $2
  
  // Mock implementation
  const userRole = 'AE'; // Get from req.user or session
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  
  if (permissions.includes('*')) return true;
  return permissions.includes(permission);
}

/**
 * Middleware: Require specific permission
 * @param {string} permission - Required permission
 * @returns {Function} Express middleware
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const hasPermission = await can(req.user.id, permission);
      
      if (!hasPermission) {
        // Log access denial for audit
        console.warn(`[RBAC] Access denied: user=${req.user.id} permission=${permission} resource=${req.path}`);
        
        return res.status(403).json({ 
          error: 'Forbidden',
          message: `Permission '${permission}' required`
        });
      }
      
      // Log successful access for audit
      console.info(`[RBAC] Access granted: user=${req.user.id} permission=${permission} resource=${req.path}`);
      
      next();
    } catch (error) {
      console.error('[RBAC] Permission check failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware: Require ANY of the permissions
 * @param {string[]} permissions - Required permissions (user needs at least one)
 * @returns {Function} Express middleware
 */
function requireAnyPermission(permissions) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const checks = await Promise.all(
        permissions.map(perm => can(req.user.id, perm))
      );
      
      if (!checks.some(Boolean)) {
        console.warn(`[RBAC] Access denied: user=${req.user.id} permissions=${permissions.join(',')} resource=${req.path}`);
        
        return res.status(403).json({ 
          error: 'Forbidden',
          message: `One of these permissions required: ${permissions.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('[RBAC] Permission check failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware: Require ALL of the permissions
 * @param {string[]} permissions - Required permissions (user needs all)
 * @returns {Function} Express middleware
 */
function requireAllPermissions(permissions) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const checks = await Promise.all(
        permissions.map(perm => can(req.user.id, perm))
      );
      
      if (!checks.every(Boolean)) {
        console.warn(`[RBAC] Access denied: user=${req.user.id} permissions=${permissions.join(',')} resource=${req.path}`);
        
        return res.status(403).json({ 
          error: 'Forbidden',
          message: `All of these permissions required: ${permissions.join(', ')}`
        });
      }
      
      next();
    } catch (error) {
      console.error('[RBAC] Permission check failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = {
  can,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
};

