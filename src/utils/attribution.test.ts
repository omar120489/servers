import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseAttribution,
  getAttributionPayload,
  markAttributionSent,
  clearAttribution,
  hasAttributionBeenSent
} from './attribution';

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-1234'
}));

describe('attribution', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    
    // Mock window.location.search
    delete (window as any).location;
    (window as any).location = { search: '' };
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('parseAttribution', () => {
    it('should parse UTM parameters from URL', () => {
      (window as any).location.search = '?utm_source=facebook&utm_campaign=spring_sale&utm_medium=cpc';

      const result = parseAttribution();

      expect(result.uti).toBe('test-uuid-1234');
      expect(result.utm.source).toBe('facebook');
      expect(result.utm.campaign).toBe('spring_sale');
      expect(result.utm.medium).toBe('cpc');
      expect(result.captured_at).toBeDefined();
    });

    it('should parse platform advertising IDs', () => {
      (window as any).location.search = '?ad_id=12345&adset_id=67890&campaign_id=abc123';

      const result = parseAttribution();

      expect(result.platform.ad_id).toBe('12345');
      expect(result.platform.adset_id).toBe('67890');
      expect(result.platform.campaign_id).toBe('abc123');
    });

    it('should parse both UTM and platform parameters', () => {
      (window as any).location.search = 
        '?utm_source=google&utm_medium=cpc&ad_id=999&campaign_id=xyz';

      const result = parseAttribution();

      expect(result.utm.source).toBe('google');
      expect(result.utm.medium).toBe('cpc');
      expect(result.platform.ad_id).toBe('999');
      expect(result.platform.campaign_id).toBe('xyz');
    });

    it('should store attribution in sessionStorage', () => {
      (window as any).location.search = '?utm_source=twitter&ad_id=555';

      parseAttribution();

      const stored = sessionStorage.getItem('traffic_crm_attribution');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.utm.source).toBe('twitter');
      expect(parsed.platform.ad_id).toBe('555');
    });

    it('should reuse existing UTI on subsequent calls', () => {
      (window as any).location.search = '?utm_source=facebook';
      
      const result1 = parseAttribution();
      const result2 = parseAttribution();

      expect(result1.uti).toBe(result2.uti);
      expect(result1.uti).toBe('test-uuid-1234');
    });

    it('should preserve existing UTMs when URL has none (hybrid logic)', () => {
      // First visit with UTMs
      (window as any).location.search = '?utm_source=facebook&utm_campaign=summer';
      parseAttribution();

      // Second visit without UTMs
      (window as any).location.search = '';
      const result = parseAttribution();

      // Should preserve original UTMs
      expect(result.utm.source).toBe('facebook');
      expect(result.utm.campaign).toBe('summer');
    });

    it('should update UTMs when new ones are present (hybrid logic)', () => {
      // First visit
      (window as any).location.search = '?utm_source=facebook&utm_campaign=summer';
      parseAttribution();

      // Second visit with different UTMs
      (window as any).location.search = '?utm_source=google&utm_campaign=winter';
      const result = parseAttribution();

      // Should update to new UTMs
      expect(result.utm.source).toBe('google');
      expect(result.utm.campaign).toBe('winter');
    });

    it('should handle URL with no parameters', () => {
      (window as any).location.search = '';

      const result = parseAttribution();

      expect(result.uti).toBeDefined();
      expect(result.utm).toBeDefined();
      expect(result.platform).toBeDefined();
      expect(result.captured_at).toBeDefined();
    });
  });

  describe('getAttributionPayload', () => {
    it('should return attribution data if not yet sent', () => {
      (window as any).location.search = '?utm_source=facebook&ad_id=123';
      parseAttribution();

      const payload = getAttributionPayload();

      expect(payload).not.toBeNull();
      expect(payload?.utm.source).toBe('facebook');
      expect(payload?.platform.ad_id).toBe('123');
    });

    it('should return null if no attribution data exists', () => {
      const payload = getAttributionPayload();

      expect(payload).toBeNull();
    });

    it('should return null after attribution has been sent', () => {
      (window as any).location.search = '?utm_source=facebook';
      parseAttribution();
      markAttributionSent();

      const payload = getAttributionPayload();

      expect(payload).toBeNull();
    });

    it('should handle malformed sessionStorage data gracefully', () => {
      sessionStorage.setItem('traffic_crm_attribution', 'invalid-json');

      const payload = getAttributionPayload();

      expect(payload).toBeNull();
    });
  });

  describe('markAttributionSent', () => {
    it('should set sent flag in sessionStorage', () => {
      markAttributionSent();

      const flag = sessionStorage.getItem('traffic_crm_attribution_sent');
      expect(flag).toBe('true');
    });

    it('should prevent getAttributionPayload from returning data', () => {
      (window as any).location.search = '?utm_source=facebook';
      parseAttribution();

      const before = getAttributionPayload();
      expect(before).not.toBeNull();

      markAttributionSent();

      const after = getAttributionPayload();
      expect(after).toBeNull();
    });
  });

  describe('hasAttributionBeenSent', () => {
    it('should return false initially', () => {
      expect(hasAttributionBeenSent()).toBe(false);
    });

    it('should return true after markAttributionSent is called', () => {
      markAttributionSent();
      expect(hasAttributionBeenSent()).toBe(true);
    });
  });

  describe('clearAttribution', () => {
    it('should remove all attribution data from sessionStorage', () => {
      (window as any).location.search = '?utm_source=facebook';
      parseAttribution();
      markAttributionSent();

      clearAttribution();

      expect(sessionStorage.getItem('traffic_crm_uti')).toBeNull();
      expect(sessionStorage.getItem('traffic_crm_attribution')).toBeNull();
      expect(sessionStorage.getItem('traffic_crm_attribution_sent')).toBeNull();
    });

    it('should allow fresh attribution after clear', () => {
      (window as any).location.search = '?utm_source=facebook';
      parseAttribution();
      markAttributionSent();

      clearAttribution();

      (window as any).location.search = '?utm_source=twitter';
      parseAttribution();
      const payload = getAttributionPayload();

      expect(payload).not.toBeNull();
      expect(payload?.utm.source).toBe('twitter');
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in UTM parameters', () => {
      (window as any).location.search = 
        '?utm_source=email&utm_campaign=hello%20world&utm_content=50%25%20off';

      const result = parseAttribution();

      expect(result.utm.source).toBe('email');
      expect(result.utm.campaign).toBe('hello world');
      expect(result.utm.content).toBe('50% off');
    });

    it('should handle missing optional UTM parameters', () => {
      (window as any).location.search = '?utm_source=facebook';

      const result = parseAttribution();

      expect(result.utm.source).toBe('facebook');
      expect(result.utm.medium).toBeUndefined();
      expect(result.utm.campaign).toBeUndefined();
      expect(result.utm.term).toBeUndefined();
      expect(result.utm.content).toBeUndefined();
    });

    it('should generate valid ISO timestamp', () => {
      (window as any).location.search = '?utm_source=facebook';

      const result = parseAttribution();

      expect(() => new Date(result.captured_at)).not.toThrow();
      expect(new Date(result.captured_at).getTime()).toBeGreaterThan(0);
    });
  });
});


