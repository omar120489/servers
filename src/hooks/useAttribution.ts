import { useEffect } from 'react';
import { parseAttribution } from 'utils/attribution';

/**
 * Hook to capture and parse attribution data from URL on app mount
 * Runs once per session to extract UTM parameters and platform IDs
 * 
 * Usage: Call once in App.jsx or root component
 */
export function useAttribution(): void {
  useEffect(() => {
    try {
      // Parse and store attribution data from current URL
      const attribution = parseAttribution();
      
      if (import.meta.env.DEV) {
        const hasUtm = Object.values(attribution.utm).some(Boolean);
        const hasPlatform = Object.values(attribution.platform).some(Boolean);
        
        if (hasUtm || hasPlatform) {
          console.log('[Attribution] Captured:', {
            uti: attribution.uti,
            utm: attribution.utm,
            platform: attribution.platform
          });
        }
      }
    } catch (error) {
      console.error('[Attribution] Failed to parse attribution:', error);
    }
  }, []); // Empty deps - run once on mount
}

