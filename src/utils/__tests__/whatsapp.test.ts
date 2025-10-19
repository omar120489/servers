/**
 * WhatsApp Utilities Tests
 */

import { canSendFreeform } from '../whatsapp';

describe('WhatsApp Utilities', () => {
  describe('canSendFreeform()', () => {
    it('should return false when no last message timestamp', () => {
      expect(canSendFreeform(null)).toBe(false);
    });

    it('should return true when last message < 24h ago', () => {
      const recentMessage = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
      expect(canSendFreeform(recentMessage)).toBe(true);
    });

    it('should return true when last message exactly 24h ago', () => {
      const exactlyOneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(canSendFreeform(exactlyOneDayAgo)).toBe(true);
    });

    it('should return false when last message > 24h ago', () => {
      const oldMessage = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      expect(canSendFreeform(oldMessage)).toBe(false);
    });

    it('should return false when last message is 48h ago', () => {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      expect(canSendFreeform(twoDaysAgo)).toBe(false);
    });

    it('should return true when last message is 1 minute ago', () => {
      const justNow = new Date(Date.now() - 60 * 1000); // 1 minute ago
      expect(canSendFreeform(justNow)).toBe(true);
    });
  });
});

