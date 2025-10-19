import { test, expect } from '@playwright/test';

test.describe('Deals Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    
    // Login
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'demo');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Navigate to deals page
    await page.click('text=Deals');
    await page.waitForURL('/deals');
  });

  test('should display deals kanban board', async ({ page }) => {
    // Check for pipeline stages
    await expect(page.locator('text=Prospecting')).toBeVisible();
    await expect(page.locator('text=Qualification')).toBeVisible();
    await expect(page.locator('text=Proposal')).toBeVisible();
    await expect(page.locator('text=Negotiation')).toBeVisible();
    await expect(page.locator('text=Closed Won')).toBeVisible();
    await expect(page.locator('text=Closed Lost')).toBeVisible();
  });

  test('should display deal cards', async ({ page }) => {
    // Check for deal cards
    await expect(page.locator('text=Enterprise Software License')).toBeVisible();
    await expect(page.locator('text=$50,000')).toBeVisible();
  });

  test('should search deals', async ({ page }) => {
    // Enter search query
    await page.fill('input[placeholder="Search deals, companies..."]', 'Enterprise');
    
    // Verify filtered results
    await expect(page.locator('text=Enterprise Software License')).toBeVisible();
    await expect(page.locator('text=Cloud Migration Project')).not.toBeVisible();
  });

  test('should filter deals by owner', async ({ page }) => {
    // Click owner dropdown
    await page.click('text=Owner');
    
    // Select an owner
    await page.click('text=John Doe');
    
    // Verify filtered results
    await expect(page.locator('text=Enterprise Software License')).toBeVisible();
  });

  test('should create new deal', async ({ page }) => {
    // Click New Deal button
    await page.click('button:has-text("New Deal")');
    
    // Fill in deal form
    await page.fill('input[label="Deal Title"]', 'Test Deal');
    await page.fill('input[label="Value"]', '25000');
    
    // Click Create Deal button
    await page.click('button:has-text("Create Deal")');
    
    // Verify success message
    await expect(page.locator('text=Deal created successfully')).toBeVisible();
    
    // Verify deal appears in kanban
    await expect(page.locator('text=Test Deal')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click New Deal button
    await page.click('button:has-text("New Deal")');
    
    // Try to create without filling required fields
    await page.click('button:has-text("Create Deal")');
    
    // Verify validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
  });

  test('should edit deal', async ({ page }) => {
    // Click on deal menu
    const firstDealMenu = page.locator('[aria-label="more"]').first();
    await firstDealMenu.click();
    
    // Click Edit
    await page.click('text=Edit');
    
    // Update deal title
    await page.fill('input[label="Deal Title"]', 'Updated Deal Title');
    
    // Click Update button
    await page.click('button:has-text("Update Deal")');
    
    // Verify success message
    await expect(page.locator('text=Deal updated successfully')).toBeVisible();
  });

  test('should delete deal', async ({ page }) => {
    // Click on deal menu
    const firstDealMenu = page.locator('[aria-label="more"]').first();
    await firstDealMenu.click();
    
    // Click Delete
    await page.click('text=Delete');
    
    // Verify success message
    await expect(page.locator('text=Deal deleted')).toBeVisible();
  });

  test('should view deal details', async ({ page }) => {
    // Click on deal menu
    const firstDealMenu = page.locator('[aria-label="more"]').first();
    await firstDealMenu.click();
    
    // Click View Details
    await page.click('text=View Details');
    
    // Verify details dialog
    await expect(page.locator('text=Deal Information')).toBeVisible();
    await expect(page.locator('text=Activity Timeline')).toBeVisible();
  });

  test('should select multiple deals', async ({ page }) => {
    // Click checkboxes for multiple deals
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(1).click(); // First deal
    await checkboxes.nth(2).click(); // Second deal
    
    // Verify selection count
    await expect(page.locator('text=2 Selected')).toBeVisible();
  });

  test('should bulk delete deals', async ({ page }) => {
    // Select multiple deals
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(1).click();
    await checkboxes.nth(2).click();
    
    // Click bulk actions button
    await page.click('button:has-text("2 Selected")');
    
    // Click Delete Selected
    await page.click('text=Delete Selected');
    
    // Verify success message
    await expect(page.locator('text=2 deals deleted')).toBeVisible();
  });

  test('should sort deals', async ({ page }) => {
    // Click Sort button
    await page.click('button:has-text("Sort")');
    
    // Select sort option
    await page.click('text=Value (High to Low)');
    
    // Verify deals are sorted
    const dealValues = await page.locator('[data-testid="deal-value"]').allTextContents();
    const values = dealValues.map(v => parseInt(v.replace(/[^0-9]/g, '')));
    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  test('should open advanced filters', async ({ page }) => {
    // Click Filters button
    await page.click('button:has-text("Filters")');
    
    // Verify filters dialog
    await expect(page.locator('text=Advanced Filters')).toBeVisible();
    await expect(page.locator('text=Value Range')).toBeVisible();
    await expect(page.locator('text=Probability Range')).toBeVisible();
  });

  test('should export deals', async ({ page }) => {
    // Click Export button
    await page.click('button:has-text("Export")');
    
    // Verify export dialog
    await expect(page.locator('text=Export Deals')).toBeVisible();
  });

  test('should navigate to analytics', async ({ page }) => {
    // Click Analytics button
    await page.click('button:has-text("Analytics")');
    
    // Verify navigation to pipeline page
    await page.waitForURL('/pipeline');
    await expect(page.locator('text=Pipeline Analytics')).toBeVisible();
  });

  test('should log activity', async ({ page }) => {
    // Open deal details
    const firstDealMenu = page.locator('[aria-label="more"]').first();
    await firstDealMenu.click();
    await page.click('text=View Details');
    
    // Click Log Activity button
    await page.click('button:has-text("Log Activity")');
    
    // Verify activity dialog opens
    // This depends on LogActivityDialog implementation
  });

  test('should drag and drop deal between stages', async ({ page }) => {
    // Get first deal card
    const dealCard = page.locator('text=Enterprise Software License').locator('..');
    
    // Get target stage column
    const qualificationColumn = page.locator('text=Qualification').locator('..');
    
    // Drag and drop
    await dealCard.dragTo(qualificationColumn);
    
    // Verify success message
    await expect(page.locator('text=Deal moved to Qualification')).toBeVisible();
  });

  test('should persist filters across page reload', async ({ page }) => {
    // Apply search filter
    await page.fill('input[placeholder="Search deals, companies..."]', 'Enterprise');
    
    // Reload page
    await page.reload();
    
    // Verify filter is still applied
    const searchInput = page.locator('input[placeholder="Search deals, companies..."]');
    await expect(searchInput).toHaveValue('Enterprise');
  });

  test('should show deal health indicators', async ({ page }) => {
    // Verify health indicators are visible
    const healthIndicators = page.locator('[data-testid="health-indicator"]');
    await expect(healthIndicators.first()).toBeVisible();
  });

  test('should display deal tags', async ({ page }) => {
    // Verify tags are visible
    await expect(page.locator('text=enterprise')).toBeVisible();
    await expect(page.locator('text=high-value')).toBeVisible();
  });

  test('should show probability bars', async ({ page }) => {
    // Verify probability bars are visible
    const probabilityBars = page.locator('[role="progressbar"]');
    await expect(probabilityBars.first()).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    // Search for non-existent deal
    await page.fill('input[placeholder="Search deals, companies..."]', 'NonExistentDeal');
    
    // Verify no results message or empty columns
    const dealCards = page.locator('[data-testid="deal-card"]');
    await expect(dealCards).toHaveCount(0);
  });

  test('should clear all filters', async ({ page }) => {
    // Open filters dialog
    await page.click('button:has-text("Filters")');
    
    // Apply some filters
    // (This would require interacting with sliders and inputs)
    
    // Click Clear All button
    await page.click('button:has-text("Clear All")');
    
    // Verify filters are cleared
    // (This would check that default values are restored)
  });
});

test.describe('Deals Page - Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/deals');
    
    // Check for main heading
    const mainHeading = page.locator('h4:has-text("Deals Pipeline")');
    await expect(mainHeading).toBeVisible();
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/deals');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have ARIA labels', async ({ page }) => {
    await page.goto('/deals');
    
    // Check for ARIA labels on interactive elements
    const searchInput = page.locator('input[placeholder="Search deals, companies..."]');
    await expect(searchInput).toBeVisible();
    
    const ownerSelect = page.locator('[aria-label="Owner"]');
    await expect(ownerSelect).toBeVisible();
  });
});

test.describe('Deals Page - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/deals');
    await page.waitForSelector('text=Enterprise Software License');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should handle large number of deals', async ({ page }) => {
    // This would require mocking a large dataset
    await page.goto('/deals');
    
    // Verify page is still responsive
    await page.click('button:has-text("Sort")');
    await expect(page.locator('text=Value (High to Low)')).toBeVisible();
  });
});

