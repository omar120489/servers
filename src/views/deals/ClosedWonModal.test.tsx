import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ClosedWonModal from './ClosedWonModal';

describe('ClosedWonModal', () => {
  it('renders with form fields', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    expect(screen.getByLabelText(/gross revenue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/direct cost/i)).toBeInTheDocument();
    expect(screen.getByText(/net profit/i)).toBeInTheDocument();
  });

  it('validates and computes net profit', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    const revenue = screen.getByLabelText(/gross revenue/i);
    const cost = screen.getByLabelText(/direct cost/i);

    await user.type(revenue, '1200');
    await user.type(cost, '300');

    // Net profit should be displayed as $900.00
    expect(screen.getByText(/\$900\.00/i)).toBeInTheDocument();

    // Confirm button should be enabled
    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn).toBeEnabled();

    await user.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledWith({ grossRevenue: 1200, directCost: 300 });
  });

  it('disables confirm button when values are invalid', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  it('disables confirm button for zero values', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    const revenue = screen.getByLabelText(/gross revenue/i);
    const cost = screen.getByLabelText(/direct cost/i);

    await user.type(revenue, '0');
    await user.type(cost, '0');

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  it('disables confirm button for negative values', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    const revenue = screen.getByLabelText(/gross revenue/i);

    await user.type(revenue, '-100');

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('computes negative net profit correctly', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ClosedWonModal open onClose={onClose} onConfirm={onConfirm} />);

    const revenue = screen.getByLabelText(/gross revenue/i);
    const cost = screen.getByLabelText(/direct cost/i);

    await user.type(revenue, '100');
    await user.type(cost, '300');

    // Net profit should be -$200.00
    expect(screen.getByText(/-\$200\.00/i)).toBeInTheDocument();
  });
});


