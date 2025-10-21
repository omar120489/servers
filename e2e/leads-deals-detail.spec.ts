import { test, expect } from '@playwright/test';

const TEST_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDB9.test';

test.describe('Leads detail & edit flow', () => {
  test('allows viewing and editing a lead', async ({ page }) => {
    let lead = {
      id: 'lead-1',
      firstName: 'Alice',
      lastName: 'Sample',
      email: 'alice@example.com',
      phone: '555-0001',
      status: 'Working',
      source: 'Web',
      ownerId: 'lead-owner-1',
      company: 'Acme Corp',
      score: 0.8,
      notes: 'Initial notes',
      createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-02T10:00:00Z').toISOString()
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

    await page.route(/.*\/api\/leads(\?.*)?$/, async (route) => {
      const request = route.request();
      if (request.method() === 'GET' && !/\/api\/leads\/[^/?]+$/.test(request.url())) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [lead],
            total: 1,
            page: 1,
            size: 10,
            pages: 1
          })
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/api/leads/lead-1', async (route) => {
      const request = route.request();
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(lead)
        });
        return;
      }

      if (request.method() === 'PATCH') {
        const payload = (await request.postDataJSON()) as Partial<{
          firstName: string;
          score: number;
          notes?: string | null;
        }>;
        expect(payload.firstName).toBe('Alexa');
        expect(payload.score).toBeCloseTo(0.75, 5);

        lead = {
          ...lead,
          firstName: payload.firstName ?? lead.firstName,
          notes:
            payload.notes === undefined
              ? lead.notes
              : payload.notes === null
                ? null
                : payload.notes,
          score: payload.score ?? lead.score,
          updatedAt: new Date('2024-01-03T10:00:00Z').toISOString()
        };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(lead)
        });
        return;
      }

      await route.continue();
    });

    await page.addInitScript(([token]) => {
      window.localStorage.setItem('serviceToken', token);
    }, [TEST_TOKEN]);

    const leadsListPromise = page.waitForResponse(
      (res) => res.url().includes('/api/leads') && res.request().method() === 'GET'
    );

    await page.goto('/leads');

    await leadsListPromise;

    await expect(page.getByText('Owner: lead-owner-1')).toBeVisible();

    await page.getByRole('button', { name: 'View' }).first().click();
    await expect(page).toHaveURL(/\/leads\/lead-1$/);
    await expect(page.getByText('Lead ID: lead-1')).toBeVisible();
    await expect(page.getByText('Owner: lead-owner-1')).toBeVisible();

    await page.getByRole('button', { name: 'Edit Lead' }).click();
    await expect(page).toHaveURL(/\/leads\/lead-1\/edit$/);
    await expect(page.getByLabel('First Name')).toHaveValue('Alice');
    await expect(page.getByLabel('Score (%)')).toHaveValue('80');

    await page.getByLabel('First Name').fill('Alexa');
    await page.getByLabel('Score (%)').fill('75');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Lead updated successfully.')).toBeVisible();
    await expect(page).toHaveURL(/\/leads\/lead-1$/);
    await expect(page.getByRole('heading', { level: 4, name: 'Alexa Sample' })).toBeVisible();
    await expect(page.getByText('75%')).toBeVisible();
  });
});

test.describe('Deals detail & edit flow', () => {
  test('allows viewing and editing a deal', async ({ page }) => {
    let deal = {
      id: 'deal-1',
      name: 'Enterprise Renewal',
      amount: 50000,
      stage: 'Negotiation',
      status: 'Open',
      probability: 0.9,
      ownerId: 'deal-owner-1',
      companyId: 'comp-1',
      contactId: 'contact-1',
      closeDate: new Date('2024-02-15T00:00:00Z').toISOString(),
      description: 'Initial enterprise renewal discussion',
      createdAt: new Date('2024-01-05T12:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-07T12:00:00Z').toISOString()
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

    await page.route(/.*\/api\/deals(\?.*)?$/, async (route) => {
      const request = route.request();
      if (request.method() === 'GET' && !/\/api\/deals\/[^/?]+$/.test(request.url())) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: [deal],
            total: 1,
            page: 1,
            size: 10,
            pages: 1
          })
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/api/deals/deal-1', async (route) => {
      const request = route.request();
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(deal)
        });
        return;
      }

      if (request.method() === 'PATCH') {
        const payload = (await request.postDataJSON()) as Partial<{
          name: string;
          amount: number;
          probability: number;
        }>;
        expect(payload.name).toBe('Updated Enterprise Renewal');
        expect(payload.probability).toBeCloseTo(0.65, 5);

        deal = {
          ...deal,
          name: payload.name ?? deal.name,
          amount: payload.amount ?? deal.amount,
          probability: payload.probability ?? deal.probability,
          updatedAt: new Date('2024-01-08T12:00:00Z').toISOString()
        };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(deal)
        });
        return;
      }

      await route.continue();
    });

    await page.addInitScript(([token]) => {
      window.localStorage.setItem('serviceToken', token);
    }, [TEST_TOKEN]);

    const dealsListPromise = page.waitForResponse(
      (res) => res.url().includes('/api/deals') && res.request().method() === 'GET'
    );

    await page.goto('/deals');

    await dealsListPromise;

    await expect(page.getByText('Enterprise Renewal')).toBeVisible();

    await page.getByRole('button', { name: 'View' }).first().click();
    await expect(page).toHaveURL(/\/deals\/deal-1$/);
    await expect(page.getByText('Deal ID: deal-1')).toBeVisible();
    await expect(page.getByText('90%')).toBeVisible();

    await page.getByRole('button', { name: 'Edit Deal' }).click();
    await expect(page).toHaveURL(/\/deals\/deal-1\/edit$/);
    await expect(page.getByLabel('Name')).toHaveValue('Enterprise Renewal');
    await expect(page.getByLabel('Probability (%)')).toHaveValue('90');

    await page.getByLabel('Name').fill('Updated Enterprise Renewal');
    await page.getByLabel('Amount').fill('75000');
    await page.getByLabel('Probability (%)').fill('65');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Deal updated successfully.')).toBeVisible();
    await expect(page).toHaveURL(/\/deals\/deal-1$/);
    await expect(
      page.getByRole('heading', { level: 4, name: 'Updated Enterprise Renewal' })
    ).toBeVisible();
    await expect(page.getByText('$75,000.00')).toBeVisible();
    await expect(page.getByText('65%')).toBeVisible();
  });
});
