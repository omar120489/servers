/**
 * Application configuration
 * Centralized config for environment variables and feature flags
 */

export const config = {
  // API endpoints
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
  
  // Feature flags
  isDemoMode: process.env.REACT_APP_DEMO === '1',
  isAIEnabled: process.env.REACT_APP_AI === '1',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // App metadata
  appName: 'Traffic CRM',
  version: '1.0.0',
} as const;

export default config;

