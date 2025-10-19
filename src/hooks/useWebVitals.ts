import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Web Vitals RUM (Real User Monitoring) Hook
 * 
 * Collects Core Web Vitals metrics and sends them to analytics.
 * 
 * Metrics collected:
 * - CLS (Cumulative Layout Shift): < 0.1 is good
 * - INP (Interaction to Next Paint): < 200ms is good (replaces FID)
 * - FCP (First Contentful Paint): < 1.8s is good
 * - LCP (Largest Contentful Paint): < 2.5s is good
 * - TTFB (Time to First Byte): < 600ms is good
 * 
 * Usage:
 * ```tsx
 * import { useWebVitals } from 'hooks/useWebVitals';
 * 
 * function App() {
 *   useWebVitals();
 *   return <YourApp />;
 * }
 * ```
 */
export function useWebVitals() {
  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to Google Analytics
        if (window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          });
        }

        // Example: Send to custom analytics endpoint
        fetch('/api/analytics/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
          keepalive: true, // Ensure the request completes even if the page is unloading
        }).catch((error) => {
          // Silently fail - don't disrupt user experience
          console.error('[Web Vitals] Failed to send metric:', error);
        });
      }
    };

    // Register all Core Web Vitals listeners
    onCLS(handleMetric);
    onINP(handleMetric); // Replaces FID as of web-vitals v3
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Cleanup is handled automatically by web-vitals library
  }, []);
}

/**
 * TypeScript declaration for gtag (Google Analytics)
 */
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      eventParams: Record<string, any>
    ) => void;
  }
}
