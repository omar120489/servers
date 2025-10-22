import { useRef } from 'react';

/**
 * Creates a debounced version of a function
 * Useful for smoothing rapid WebSocket bursts or user input
 *
 * @param fn Function to debounce
 * @param delay Delay in milliseconds (default: 250ms)
 * @returns Debounced function
 *
 * @example
 * const debouncedReload = useDebounced(reload, 250);
 * // In WS handler: debouncedReload();
 */
export const useDebounced = (fn: () => void, delay = 250) => {
  const t = useRef<ReturnType<typeof setTimeout>>();
  return () => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(fn, delay);
  };
};

