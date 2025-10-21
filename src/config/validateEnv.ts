/**
 * Fail-fast environment validation
 * Runs at application startup to ensure all required variables are present
 * Ref: Section 6.1 - Fail Fast pattern
 */
export function validateEnvironmentVariables(): void {
  const requiredEnvVars = ['VITE_APP_API_URL', 'VITE_APP_REPORTING_API_URL'];

  // In Vite, env vars are accessed via import.meta.env
  const missingEnvVars = requiredEnvVars.filter((varName) => !import.meta.env[varName]);

  if (missingEnvVars.length > 0) {
    const errorMsg = `
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ❌ FATAL ERROR: Missing Required Environment Variables         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Missing variables:                                             │
${missingEnvVars.map((v) => `│    - ${v.padEnd(55)}│`).join('\n')}
│                                                                 │
│  Action required:                                               │
│    1. Copy .env.example to .env                                 │
│    2. Fill in the required values                               │
│    3. Restart the application                                   │
│                                                                 │
│  See: docs/port-management.md for configuration details         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
`;
    console.error(errorMsg);
    // Throwing an error is better than process.exit in a browser context
    throw new Error('Environment validation failed. Halting application startup.');
  }

  console.log('✅ Environment configuration validated successfully');
}
