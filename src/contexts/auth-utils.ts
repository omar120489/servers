/**
 * Shared authentication utilities for provider-agnostic auth operations
 */

import { jwtDecode } from 'jwt-decode';
import axiosServices from 'utils/axios';
import type { UserProfile } from 'types/auth';

// ==============================|| TOKEN MANAGEMENT ||============================== //

/**
 * Verify if a JWT token is valid and not expired
 * @param serviceToken - JWT token to verify
 * @returns boolean indicating if token is valid
 */
export function verifyToken(serviceToken: string | null): boolean {
  if (!serviceToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(serviceToken);

    // Ensure 'exp' exists and compare it to the current timestamp
    if (!decoded.exp) {
      throw new Error("Token does not contain 'exp' property.");
    }

    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

/**
 * Set or clear authentication session
 * @param serviceToken - JWT token to set, or null to clear
 */
export function setSession(serviceToken: string | null): void {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axiosServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axiosServices.defaults.headers.common.Authorization;
  }
}

/**
 * Clear all auth-related data from storage
 */
export function clearAuthStorage(): void {
  const authKeys = ['serviceToken', 'accessToken', 'refreshToken', 'users'];
  authKeys.forEach((key) => localStorage.removeItem(key));
}

// ==============================|| PROFILE MAPPING ||============================== //

/**
 * Map Auth0 user profile to standard UserProfile
 */
export function mapAuth0Profile(auth0User: any): UserProfile {
  return {
    id: auth0User.sub,
    email: auth0User.email,
    firstName: auth0User.given_name || auth0User.name?.split(' ')[0],
    lastName: auth0User.family_name || auth0User.name?.split(' ')[1],
    name: auth0User.name,
    role: auth0User['https://app.example.com/roles']?.[0] || 'user'
  };
}

/**
 * Map Firebase user profile to standard UserProfile
 */
export function mapFirebaseProfile(firebaseUser: any): UserProfile {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName: firebaseUser.displayName?.split(' ')[0] || '',
    lastName: firebaseUser.displayName?.split(' ')[1] || '',
    name: firebaseUser.displayName || '',
    role: firebaseUser.customClaims?.role || 'user'
  };
}

/**
 * Map AWS Cognito user profile to standard UserProfile
 */
export function mapCognitoProfile(cognitoUser: any, attributes: any = {}): UserProfile {
  return {
    id: cognitoUser.username || cognitoUser.sub,
    email: attributes.email || cognitoUser.attributes?.email,
    firstName: attributes.given_name || cognitoUser.attributes?.given_name,
    lastName: attributes.family_name || cognitoUser.attributes?.family_name,
    name:
      attributes.name ||
      cognitoUser.attributes?.name ||
      `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
    role: attributes['custom:role'] || cognitoUser.attributes?.['custom:role'] || 'user'
  };
}

/**
 * Map Supabase user profile to standard UserProfile
 */
export function mapSupabaseProfile(supabaseUser: any): UserProfile {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    firstName:
      supabaseUser.user_metadata?.firstName ||
      supabaseUser.user_metadata?.first_name ||
      supabaseUser.user_metadata?.full_name?.split(' ')[0],
    lastName:
      supabaseUser.user_metadata?.lastName ||
      supabaseUser.user_metadata?.last_name ||
      supabaseUser.user_metadata?.full_name?.split(' ')[1],
    name:
      supabaseUser.user_metadata?.full_name ||
      `${supabaseUser.user_metadata?.firstName || ''} ${supabaseUser.user_metadata?.lastName || ''}`.trim(),
    role: supabaseUser.app_metadata?.role || 'user'
  };
}

/**
 * Generic profile mapper with fallbacks
 */
export function mapGenericProfile(user: any, provider: string): UserProfile {
  console.warn(
    `Using generic profile mapper for ${provider}. Consider implementing specific mapper.`
  );

  return {
    id: user.id || user.sub || user.uid || user.username || 'unknown',
    email: user.email || '',
    firstName: user.firstName || user.given_name || user.first_name || '',
    lastName: user.lastName || user.family_name || user.last_name || '',
    name: user.name || user.displayName || user.full_name || '',
    role: user.role || 'user'
  };
}

// ==============================|| ERROR HANDLING ||============================== //

/**
 * Standardized auth error handling
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public provider: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Handle auth errors consistently across providers
 */
export function handleAuthError(error: any, provider: string, operation: string): never {
  console.error(`${provider} ${operation} error:`, error);

  let message = `${operation} failed`;

  if (error?.message) {
    message = error.message;
  } else if (error?.error_description) {
    message = error.error_description;
  } else if (typeof error === 'string') {
    message = error;
  }

  throw new AuthError(message, provider, error);
}

// ==============================|| VALIDATION ||============================== //

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (basic)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
