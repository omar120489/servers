/**
 * Assignment & Auto-Convert Tests
 */

// cspell:ignore Tanaka
import { routeLead, shouldAutoConvert } from '../assignment';
import type { Lead } from '../../types/crm';

describe('Assignment Utilities', () => {
  describe('routeLead()', () => {
    it('should route EU domain lead to EMEA pool', () => {
      const lead: Lead = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@company.eu',
        status: 'new',
      };

      const ownerId = routeLead(lead);
      expect(ownerId).toBe('user-emea-1');
    });

    it('should route JP domain lead to APAC pool', () => {
      const lead: Lead = {
        id: 2,
        first_name: 'Yuki',
        last_name: 'Tanaka',
        email: 'yuki@company.jp',
        status: 'new',
      };

      const ownerId = routeLead(lead);
      expect(ownerId).toBe('user-apac-1');
    });

    it('should route SG domain lead to APAC pool', () => {
      const lead: Lead = {
        id: 3,
        first_name: 'Wei',
        last_name: 'Chen',
        email: 'wei@company.sg',
        status: 'new',
      };

      const ownerId = routeLead(lead);
      expect(ownerId).toBe('user-apac-1');
    });

    it('should route other domains to Americas pool', () => {
      const lead: Lead = {
        id: 4,
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob@company.com',
        status: 'new',
      };

      const ownerId = routeLead(lead);
      expect(ownerId).toBe('user-amer-1');
    });

    it('should route lead without email to Americas pool', () => {
      const lead: Lead = {
        id: 5,
        first_name: 'Unknown',
        last_name: 'User',
        status: 'new',
      };

      const ownerId = routeLead(lead);
      expect(ownerId).toBe('user-amer-1');
    });
  });

  describe('shouldAutoConvert()', () => {
    it('should return true for high-score lead (score >= 90)', () => {
      const lead: Lead = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        score: 90,
        status: 'qualified',
      };

      expect(shouldAutoConvert(lead)).toBe(true);
    });

    it('should return true for score > 90', () => {
      const lead: Lead = {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        score: 95,
        status: 'new',
      };

      expect(shouldAutoConvert(lead)).toBe(true);
    });

    it('should return false for low-score lead (score < 90)', () => {
      const lead: Lead = {
        id: 3,
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob@example.com',
        score: 85,
        status: 'qualified',
      };

      expect(shouldAutoConvert(lead)).toBe(false);
    });

    it('should return false for converted lead', () => {
      const lead: Lead = {
        id: 4,
        first_name: 'Alice',
        last_name: 'Brown',
        email: 'alice@example.com',
        score: 95,
        status: 'converted',
      };

      expect(shouldAutoConvert(lead)).toBe(false);
    });

    it('should return false for lead without score', () => {
      const lead: Lead = {
        id: 5,
        first_name: 'Charlie',
        last_name: 'Davis',
        email: 'charlie@example.com',
        status: 'qualified',
      };

      expect(shouldAutoConvert(lead)).toBe(false);
    });
  });
});
