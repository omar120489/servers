import { test, expect } from '@playwright/test';

test('app boots & shows login', async ({ page }) => {
  await page.goto('/');
  // if protected, should redirect to /login
  await expect(page).toHaveURL(/login/);
});

test('contacts list loads after login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('demo@example.com');
  await page.getByLabel(/password/i).fill('demo');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL('**/');
  await page.goto('/contacts');
  await expect(page.getByText(/contacts/i)).toBeVisible();
});

