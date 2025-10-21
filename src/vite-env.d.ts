/// <reference types="vite/client" />

// cspell:words SUPABASE COGNITO

interface ImportMetaEnv {
  readonly VITE_APP_BASE_NAME?: string;
  readonly VITE_APP_API_URL?: string;
  readonly VITE_APP_REPORTING_API_URL?: string;
  readonly VITE_APP_FIREBASE_API_KEY?: string;
  readonly VITE_APP_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_APP_FIREBASE_PROJECT_ID?: string;
  readonly VITE_APP_AUTH0_DOMAIN?: string;
  readonly VITE_APP_AUTH0_CLIENT_ID?: string;
  readonly VITE_APP_AWS_COGNITO_USER_POOL_ID?: string;
  readonly VITE_APP_AWS_COGNITO_CLIENT_ID?: string;
  readonly VITE_APP_SUPABASE_URL?: string;
  readonly VITE_APP_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
