import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Make React treat this env as act-enabled (reduces act() warnings)
// https://react.dev/reference/react/act#test-environments
// This is safe for React 18+ testing with RTL.
// @ts-expect-error - global flag used by React 18 test utils
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Cleanup after each test
afterEach(() => {
  cleanup();
});

