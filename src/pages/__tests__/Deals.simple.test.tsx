import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Deals from '../Deals';

// Mock the API client
jest.mock('../../api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Deals Page - Simple Tests', () => {
  const renderDeals = () => {
    return render(
      <BrowserRouter>
        <Deals />
      </BrowserRouter>
    );
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

