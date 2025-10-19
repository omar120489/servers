/**
 * Network-aware prefetch guard
 * 
 * Prevents prefetching on slow or metered connections to save bandwidth
 * and improve performance for users on constrained networks.
 * 
 * Usage:
 * ```tsx
 * import { canPrefetch } from 'utils/prefetch.guard';
 * 
 * const handlePrefetch = (path: string) => {
 *   if (!canPrefetch()) return;
 *   prefetchMap[path]?.();
 * };
 * ```
 */

export interface NetworkInformation extends EventTarget {
  readonly effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  readonly saveData: boolean;
  readonly downlink: number;
  readonly rtt: number;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

/**
 * Check if prefetching is allowed based on network conditions
 * 
 * Returns false if:
 * - User has enabled "Save Data" mode
 * - Connection is 2G or slower
 * - Connection RTT (round-trip time) is > 400ms
 * - Downlink speed is < 1 Mbps
 * 
 * @returns {boolean} True if prefetching is safe, false otherwise
 */
export function canPrefetch(): boolean {
  // Always allow prefetch in development
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    return true;
  }

  // Check if Network Information API is available
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) {
    // If API is not available, allow prefetch (better to prefetch than not)
    return true;
  }

  // Don't prefetch if user has enabled "Save Data" mode
  if (connection.saveData) {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      console.log('[Prefetch Guard] Blocked: Save Data mode enabled');
    }
    return false;
  }

  // Don't prefetch on 2G or slower connections
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      console.log('[Prefetch Guard] Blocked: Slow connection detected', connection.effectiveType);
    }
    return false;
  }

  // Don't prefetch if RTT (round-trip time) is too high (> 400ms)
  if (connection.rtt > 400) {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      console.log('[Prefetch Guard] Blocked: High latency detected', connection.rtt, 'ms');
    }
    return false;
  }

  // Don't prefetch if downlink speed is too slow (< 1 Mbps)
  if (connection.downlink < 1) {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      console.log('[Prefetch Guard] Blocked: Low bandwidth detected', connection.downlink, 'Mbps');
    }
    return false;
  }

  // All checks passed - safe to prefetch
  return true;
}

/**
 * Get current network information for debugging
 * 
 * @returns {object} Network information object
 */
export function getNetworkInfo() {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) {
    return {
      available: false,
      message: 'Network Information API not available',
    };
  }

  return {
    available: true,
    effectiveType: connection.effectiveType,
    saveData: connection.saveData,
    downlink: connection.downlink,
    rtt: connection.rtt,
    canPrefetch: canPrefetch(),
  };
}

