/**
 * @deprecated This file is deprecated. Use `src/api/client.ts` instead.
 * 
 * All services should import from '../api/client' for centralized HTTP client.
 * This file is kept temporarily for backward compatibility but will be removed.
 * 
 * Migration guide:
 * - Old: import api from './api';
 * - New: import { api } from '../api/client';
 */

import { api } from '../api/client';

// Re-export for backward compatibility
export default api;
export { api };
