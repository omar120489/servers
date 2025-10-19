import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

/**
 * FocusOnNavigate manages focus for accessibility on route changes.
 * 
 * Strategy:
 * 1. Try to focus the main h1 heading (best for screen readers)
 * 2. Fall back to the main landmark if no h1 is found
 * 3. Announce the navigation via aria-live region
 * 
 * This follows WCAG 2.1 SC 2.4.3 (Focus Order) and is a recommended SPA pattern.
 * 
 * @see https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html
 */
export default function FocusOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure lazy-loaded content is rendered
    const timer = setTimeout(() => {
      // Strategy 1: Focus the main h1 heading (best for context)
      const mainHeading = document.querySelector('main h1') as HTMLElement;
      if (mainHeading) {
        mainHeading.setAttribute('tabIndex', '-1');
        mainHeading.focus();
        // Remove tabIndex after focus to prevent it from being in tab order
        mainHeading.addEventListener('blur', () => mainHeading.removeAttribute('tabIndex'), { once: true });
        return;
      }

      // Strategy 2: Focus the main landmark
      const mainLandmark = document.querySelector('main, [role="main"]') as HTMLElement;
      if (mainLandmark) {
        mainLandmark.focus();
      }
    }, 150); // Slightly longer delay for lazy-loaded chunks

    return () => clearTimeout(timer);
  }, [pathname]);

  // Visually hidden aria-live region for screen reader announcements
  return (
    <Box
      component="div"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      sx={visuallyHidden}
    >
      Navigated to {pathname.replace(/^\//, '').replace(/-/g, ' ') || 'home'}
    </Box>
  );
}

