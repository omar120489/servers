import { test, expect } from '@playwright/test';

const TEST_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDB9.test';

test.describe('Analytics dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(([token]) => {
      window.localStorage.setItem('serviceToken', token);
    }, [TEST_TOKEN]);

    const defaultKpis = {
      leadsCreated: 12,
      dealsCreated: 8,
      dealsWon: 5,
      winRate: 41.7,
      avgCycleDays: 28.4,
      revenue: 125000,
      roas: 3.2
    };

    const altKpis = {
      ...defaultKpis,
      leadsCreated: 20,
      dealsCreated: 14
    };

    await page.route('**/api/account/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user-1',
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User'
          }
        })
      });
    });

    await page.route('**/api/reporting/kpis**', async (route) => {
      const url = new URL(route.request().url());
      const dateFrom = url.searchParams.get('dateFrom');
      const payload = dateFrom === '2024-01-01' ? altKpis : defaultKpis;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(payload)
      });
    });

    await page.route('**/api/reporting/funnel**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: 'Discovery', count: 50, conversionRate: 60 },
          { name: 'Proposal', count: 25, conversionRate: 40 },
          { name: 'Negotiation', count: 10, conversionRate: 25 }
        ])
      });
    });

    await page.route('**/api/reporting/trends**', async (route) => {
      const url = new URL(route.request().url());
      const interval = url.searchParams.get('interval');
      const body =
        interval === 'week'
          ? [
              { date: '2024-01-01', value: 4 },
              { date: '2024-01-08', value: 6 }
            ]
          : [
              { date: '2024-01-01', value: 2 },
              { date: '2024-01-02', value: 3 },
              { date: '2024-01-03', value: 4 }
            ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body)
      });
    });

    await page.route('**/api/reporting/cohorts**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cohortKey: '2023-12', total: 40, converted: 10, conversionRate: 25 },
          { cohortKey: '2024-01', total: 50, converted: 20, conversionRate: 40 }
        ])
      });
    });
  });

  test('renders KPIs, updates with filters, and supports drill-down', async ({ page }) => {
    const kpisResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/reporting/kpis') && res.status() === 200
    );

    await page.goto('/analytics', { waitUntil: 'networkidle' });

    const kpisResponse = await kpisResponsePromise;
    expect(kpisResponse.status()).toBe(200);

    await expect(page.getByTestId('kpi-leads-created')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('kpi-deals-created')).toBeVisible({ timeout: 10000 });

    await expect(page.getByTestId('kpi-leads-created')).toContainText('12');
    await expect(page.getByTestId('kpi-deals-created')).toContainText('8');
    await expect(page.getByText('Discovery')).toBeVisible();

    const refetchPromise = page.waitForResponse(
      (res) => res.url().includes('/api/reporting/kpis') && res.status() === 200
    );
    await page.getByLabel('Date From').fill('2024-01-01');
    await page.getByRole('button', { name: 'Apply' }).click();
    await refetchPromise;
    await page.waitForTimeout(50);
    await expect(page.getByTestId('kpi-leads-created')).toContainText('20');

    const trendsPromise = page.waitForResponse(
      (res) => res.url().includes('/api/reporting/trends') && res.status() === 200
    );
    await page.getByLabel('Trend Interval').click();
    await page.getByRole('option', { name: 'Weekly' }).click();
    await trendsPromise;
    await expect(page.getByText('2024-01-08')).toBeVisible();

    await page.getByTestId('kpi-deals-created').click();
    await expect(page).toHaveURL(/\/deals\?.*dateFrom=2024-01-01/);
    await expect(page.getByText(/Active filters/i)).toBeVisible();

    await page.goBack();
    await page.getByText('Discovery').click();
    await expect(page).toHaveURL(/\/deals\?.*stage=Discovery/);
  });
});
