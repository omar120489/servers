/**
 * RBAC Utilities Tests
 */

import { can, canViewTimeline, canLogActivity, canAll, canAny, getPermissionsForRole } from '../rbac';

describe('RBAC Utilities', () => {
  describe('can()', () => {
    it('should grant permission when role has it', () => {
      expect(can('AE', 'lead:read')).toBe(true);
      expect(can('AE', 'deal:read')).toBe(true);
    });

    it('should deny permission when role lacks it', () => {
      expect(can('SDR', 'deal:read')).toBe(false);
      expect(can('Support', 'lead:write')).toBe(false);
    });

    it('should grant all permissions to Admin', () => {
      expect(can('Admin', 'lead:read')).toBe(true);
      expect(can('Admin', 'deal:delete')).toBe(true);
      expect(can('Admin', 'admin:users')).toBe(true);
    });
  });

  describe('canViewTimeline()', () => {
    it('should allow SDR and AE to view timeline', () => {
      expect(canViewTimeline('SDR')).toBe(true);
      expect(canViewTimeline('AE')).toBe(true);
    });

    it('should deny Support from viewing timeline', () => {
      expect(canViewTimeline('Support')).toBe(false);
    });
  });

  describe('canLogActivity()', () => {
    it('should allow SDR and AE to log activities', () => {
      expect(canLogActivity('SDR')).toBe(true);
      expect(canLogActivity('AE')).toBe(true);
    });

    it('should deny Support from logging activities', () => {
      expect(canLogActivity('Support')).toBe(false);
    });
  });

  describe('canAll()', () => {
    it('should return true when user has all permissions', () => {
      expect(canAll('AE', ['lead:read', 'deal:read'])).toBe(true);
    });

    it('should return false when user lacks any permission', () => {
      expect(canAll('SDR', ['lead:read', 'deal:read'])).toBe(false);
    });
  });

  describe('canAny()', () => {
    it('should return true when user has any permission', () => {
      expect(canAny('SDR', ['lead:read', 'deal:read'])).toBe(true);
    });

    it('should return false when user has no permissions', () => {
      expect(canAny('Support', ['lead:write', 'deal:write'])).toBe(false);
    });
  });

  describe('getPermissionsForRole()', () => {
    it('should return all permissions for a role', () => {
      const permissions = getPermissionsForRole('AE');
      expect(permissions).toContain('lead:read');
      expect(permissions).toContain('deal:read');
      expect(permissions.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown role', () => {
      const permissions = getPermissionsForRole('Unknown' as any);
      expect(permissions).toEqual([]);
    });
  });
});

