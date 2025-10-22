/**
 * Lightweight telemetry helper
 * No-op by default; wire to your analytics platform when ready
 *
 * @example
 * // PostHog
 * window.posthog?.capture(event, props);
 *
 * // Mixpanel
 * window.mixpanel?.track(event, props);
 *
 * // Google Analytics
 * window.gtag?.('event', event, props);
 */
export const track = (event: string, props?: Record<string, unknown>): void => {
  // No-op by default - prevents errors when analytics not configured
  // Uncomment the line below when you're ready to wire analytics:
  // window.posthog?.capture(event, props);

  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, props);
  }
};

