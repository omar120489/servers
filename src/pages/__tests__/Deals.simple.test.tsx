import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import '@testing-library/jest-dom';
import Deals from '../Deals';

// Mock axios to prevent ESM import errors
jest.mock('axios');

// Mock React Query hooks with proper data structure
jest.mock('../../hooks/useDeals', () => ({
  useDeals: () => ({
    data: {
      data: [
        { id: 1, title: 'Test Deal', value: 50000, stage: 'Prospecting', company: 'Test Co', contact: 'John Doe', probability: 50, expectedCloseDate: '2024-12-31' },
      ],
      total: 1,
    },
    isLoading: false,
    error: null,
  }),
  useBulkUpdateDeals: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useBulkDeleteDeals: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

describe('Deals Page - Simple Tests', () => {
  const renderDeals = () => {
    // Define routes for the test
    const routes = [
      {
        path: '/deals',
        element: <Deals />,
      },
      // Mock route for deal details if needed
      {
        path: '/deals/:id',
        element: <div>Deal Detail Page Mock</div>,
      },
    ];

    // Create memory router with future flags to silence warnings and prepare for v7
    const router = createMemoryRouter(routes, {
      initialEntries: ['/deals'],
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    });

    // Render with RouterProvider and future flags
    return render(<RouterProvider router={router} future={{ v7_startTransition: true }} />);
  };

  it('should render without crashing', () => {
    const { container } = renderDeals();
    expect(container).toBeInTheDocument();
  });

  it('should render table structure', () => {
    renderDeals();
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should have search input', () => {
    renderDeals();
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should have sort button', () => {
    renderDeals();
    const sortButton = screen.getByRole('button', { name: /sort/i });
    expect(sortButton).toBeInTheDocument();
  });

  it('should have export button', () => {
    renderDeals();
    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('should have filters button', () => {
    renderDeals();
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    expect(filtersButton).toBeInTheDocument();
  });

  it('should have add deal button', () => {
    renderDeals();
    const addButton = screen.getByRole('button', { name: /add deal/i });
    expect(addButton).toBeInTheDocument();
  });
});

