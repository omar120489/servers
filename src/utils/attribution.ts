/**
 * Attribution Tracking Utility
 * 
 * Captures UTM parameters and platform advertising IDs from URL query parameters,
 * generates unique tracking identifiers (UTI) per session, and provides attribution
 * data for lead creation with one-time send guard.
 * 
 * Design:
 * - UTI stored in sessionStorage (new UTI per browser session/tab)
 * - Attribution sent only with first lead of each session
 * - Hybrid update: preserve existing UTMs if URL has none, update if present
 */

import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  UTI: 'traffic_crm_uti',
  ATTRIBUTION: 'traffic_crm_attribution',
  SENT_FLAG: 'traffic_crm_attribution_sent'
} as const;

export interface AttributionData {
  uti: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  platform: {
    ad_id?: string;
    adset_id?: string;
    campaign_id?: string;
  };
  captured_at: string;
}

/**
 * Generate a new Unique Tracking Identifier (v4 UUID)
 */
function generateUTI(): string {
  return uuidv4();
}

/**
 * Get or create UTI from sessionStorage
 */
function getOrCreateUTI(): string {
  let uti = sessionStorage.getItem(STORAGE_KEYS.UTI);
  if (!uti) {
    uti = generateUTI();
    sessionStorage.setItem(STORAGE_KEYS.UTI, uti);
  }
  return uti;
}

/**
 * Parse UTM and platform parameters from current URL
 */
function parseURLParameters(): Partial<AttributionData> {
  const params = new URLSearchParams(globalThis.location.search);
  
  const utm = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined
  };
  
  const platform = {
    ad_id: params.get('ad_id') || undefined,
    adset_id: params.get('adset_id') || undefined,
    campaign_id: params.get('campaign_id') || undefined
  };
  
  // Only return objects with at least one defined value
  const hasUtm = Object.values(utm).some(v => v !== undefined);
  const hasPlatform = Object.values(platform).some(v => v !== undefined);
  
  return {
    ...(hasUtm && { utm }),
    ...(hasPlatform && { platform })
  };
}

/**
 * Parse and store attribution data from URL
 * Implements hybrid update logic:
 * - If URL has new UTMs/platform IDs, update stored attribution
 * - If URL has no params, preserve existing attribution
 */
export function parseAttribution(): AttributionData {
  const uti = getOrCreateUTI();
  const urlParams = parseURLParameters();
  
  // Try to get existing attribution
  const existingData = sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  let existing: AttributionData | null = null;
  
  try {
    if (existingData) {
      existing = JSON.parse(existingData);
    }
  } catch (error) {
    console.warn('[Attribution] Failed to parse existing attribution:', error);
  }
  
  // Hybrid update logic
  const hasNewParams = urlParams.utm || urlParams.platform;
  
  const attribution: AttributionData = {
    uti,
    utm: {
      source: urlParams.utm?.source ?? existing?.utm?.source,
      medium: urlParams.utm?.medium ?? existing?.utm?.medium,
      campaign: urlParams.utm?.campaign ?? existing?.utm?.campaign,
      term: urlParams.utm?.term ?? existing?.utm?.term,
      content: urlParams.utm?.content ?? existing?.utm?.content
    },
    platform: {
      ad_id: urlParams.platform?.ad_id ?? existing?.platform?.ad_id,
      adset_id: urlParams.platform?.adset_id ?? existing?.platform?.adset_id,
      campaign_id: urlParams.platform?.campaign_id ?? existing?.platform?.campaign_id
    },
    captured_at: hasNewParams ? new Date().toISOString() : (existing?.captured_at || new Date().toISOString())
  };
  
  // Store updated attribution
  sessionStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(attribution));
  
  return attribution;
}

/**
 * Get attribution payload for lead creation
 * Returns null if attribution has already been sent this session
 * One-time send guard using sessionStorage flag
 */
export function getAttributionPayload(): AttributionData | null {
  const hasSent = sessionStorage.getItem(STORAGE_KEYS.SENT_FLAG) === 'true';
  
  if (hasSent) {
    return null;
  }
  
  const data = sessionStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  if (!data) {
    return null;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('[Attribution] Failed to parse attribution payload:', error);
    return null;
  }
}

/**
 * Mark attribution as sent to prevent duplicate sends
 * Should be called after successful lead creation
 */
export function markAttributionSent(): void {
  sessionStorage.setItem(STORAGE_KEYS.SENT_FLAG, 'true');
}

/**
 * Clear attribution data (useful for testing)
 */
export function clearAttribution(): void {
  sessionStorage.removeItem(STORAGE_KEYS.UTI);
  sessionStorage.removeItem(STORAGE_KEYS.ATTRIBUTION);
  sessionStorage.removeItem(STORAGE_KEYS.SENT_FLAG);
}

/**
 * Check if attribution has been sent this session
 */
export function hasAttributionBeenSent(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.SENT_FLAG) === 'true';
}

