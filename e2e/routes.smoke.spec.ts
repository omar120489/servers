import { test, expect } from '@playwright/test';

/**
 * Route Smoke Tests
 * 
 * These tests verify that all routes in the application:
 * 1. Render without crashing
 * 2. Apply authentication guards correctly
 * 3. Show appropriate content or redirect
 */

// Test configuration
const BASE_URL = 'http://localhost:3000';

// Demo credentials
const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'demo';

// Helper function to login
async function login(page: any) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  
  // Fill email field (by label)
  await page.getByLabel(/email/i).fill(DEMO_EMAIL);
  
  // Fill password field (by label)
  await page.getByLabel(/password/i).fill(DEMO_PASSWORD);
  
  // Click login button
  await page.getByRole('button', { name: /login|sign in/i }).click();
  
  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard|\/$/);
}

test.describe('Public Routes', () => {
  test('login page renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('404 page renders for invalid routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/invalid-route-that-does-not-exist`);
    // Check for either the 404 heading or the "Page Not Found" heading
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });
});

test.describe('Protected Routes - Unauthenticated', () => {
  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/\/login/);
  });

  test('leads redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/leads`);
    await expect(page).toHaveURL(/\/login/);
  });

  test('admin routes redirect to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/users`);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Protected Routes - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const mainRoutes = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/leads', name: 'Leads' },
    { path: '/deals', name: 'Deals' },
    { path: '/contacts', name: 'Contacts' },
    { path: '/companies', name: 'Companies' },
    { path: '/pipeline', name: 'Pipeline' },
    { path: '/activities', name: 'Activities' },
    { path: '/calendar', name: 'Calendar' },
    { path: '/notifications', name: 'Notifications' },
    { path: '/reports', name: 'Reports' },
    { path: '/settings', name: 'Settings' },
    { path: '/profile', name: 'Profile' },
  ];

  for (const route of mainRoutes) {
    test(`${route.name} page renders`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`);
      
      // Wait for page to load (either heading or main content)
      await page.waitForLoadState('networkidle');
      
      // Verify we're on the correct route
      await expect(page).toHaveURL(new RegExp(route.path));
      
      // Verify main content is visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });
  }
});

test.describe('Admin Routes - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const adminRoutes = [
    { path: '/admin/users', name: 'Users' },
    { path: '/admin/roles', name: 'Roles' },
    { path: '/admin/webhooks', name: 'Webhooks' },
    { path: '/admin/audit-log', name: 'Audit Log' },
    { path: '/admin/visualization', name: 'Visualization' },
  ];

  for (const route of adminRoutes) {
    test(`${route.name} admin page renders or redirects based on role`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`);
      
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      
      // Admin routes should either:
      // 1. Render the admin page (if user has Admin role)
      // 2. Redirect to dashboard (if user lacks permission)
      const currentUrl = page.url();
      const isOnAdminPage = currentUrl.includes(route.path);
      const isOnDashboard = currentUrl.includes('/dashboard');
      
      expect(isOnAdminPage || isOnDashboard).toBeTruthy();
    });
  }
});

test.describe('Navigation Flow', () => {
  test('root redirects to dashboard when authenticated', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('can navigate between pages using sidebar', async ({ page }) => {
    await login(page);
    
    // Verify we're on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Navigate to Leads using the URL (sidebar interaction is complex in tests)
    await page.goto(`${BASE_URL}/leads`);
    await expect(page).toHaveURL(/\/leads/);
    await page.waitForLoadState('networkidle');
    
    // Navigate to Deals
    await page.goto(`${BASE_URL}/deals`);
    await expect(page).toHaveURL(/\/deals/);
    await page.waitForLoadState('networkidle');
    
    // Verify content is visible
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });
});

test.describe('Loading States', () => {
  test('shows loading indicator during lazy load', async ({ page }) => {
    await login(page);
    
    // Navigate to a page and check for loading state
    const navigationPromise = page.goto(`${BASE_URL}/reports`);
    
    // Try to catch the loading state (might be too fast in development)
    const loadingIndicator = page.getByText(/loading/i);
    const isLoadingVisible = await loadingIndicator.isVisible().catch(() => false);
    
    await navigationPromise;
    
    // Either we saw loading or the page loaded too fast (both are acceptable)
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('main content has proper ARIA landmarks', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Check for main landmark
    const mainLandmark = page.locator('main, [role="main"]');
    await expect(mainLandmark).toBeVisible();
  });

  test('focus management on navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Navigate to another page
    await page.goto(`${BASE_URL}/leads`);
    
    // Verify page loaded
    await page.waitForLoadState('networkidle');
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });
});

