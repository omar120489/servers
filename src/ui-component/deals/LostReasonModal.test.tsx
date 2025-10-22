import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LostReasonModal from './LostReasonModal';

describe('LostReasonModal', () => {
  it('renders when open', () => {
    render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('Mark Deal as Lost')).toBeInTheDocument();
    expect(screen.getByLabelText(/Loss Reason/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm & Mark Lost/i })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <LostReasonModal
        open={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.queryByText('Mark Deal as Lost')).not.toBeInTheDocument();
  });

  it('disables confirm button when no reason is selected', () => {
    render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirm & Mark Lost/i });
    expect(confirmButton).toBeDisabled();
  });

  it('enables confirm button when a reason is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    // Open the dropdown
    const select = screen.getByLabelText(/Loss Reason/i);
    await user.click(select);

    // Select a reason
    const option = screen.getByRole('option', { name: /Price\/Budget/i });
    await user.click(option);

    // Confirm button should now be enabled
    const confirmButton = screen.getByRole('button', { name: /Confirm & Mark Lost/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('calls onConfirm with selected reason when confirmed', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    
    render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    // Select a reason
    const select = screen.getByLabelText(/Loss Reason/i);
    await user.click(select);
    const option = screen.getByRole('option', { name: /Competitor/i });
    await user.click(option);

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Confirm & Mark Lost/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith({
      lossReason: 'L-Competitor',
      lossNotes: undefined
    });
  });

  it('includes notes in onConfirm when provided', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    
    render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    // Select a reason
    const select = screen.getByLabelText(/Loss Reason/i);
    await user.click(select);
    const option = screen.getByRole('option', { name: /Price\/Budget/i });
    await user.click(option);

    // Add notes
    const notesInput = screen.getByLabelText(/Additional Notes/i);
    await user.type(notesInput, 'Customer found cheaper alternative');

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Confirm & Mark Lost/i });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith({
      lossReason: 'L-Price/Budget',
      lossNotes: 'Customer found cheaper alternative'
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(
      <LostReasonModal
        open={true}
        onClose={onClose}
        onConfirm={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('resets state when closed', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    // Select a reason and add notes
    const select = screen.getByLabelText(/Loss Reason/i);
    await user.click(select);
    const option = screen.getByRole('option', { name: /Price\/Budget/i });
    await user.click(option);

    const notesInput = screen.getByLabelText(/Additional Notes/i);
    await user.type(notesInput, 'Test notes');

    // Close and reopen the modal
    rerender(
      <LostReasonModal
        open={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    
    rerender(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    // Should be reset - confirm button disabled
    const confirmButton = screen.getByRole('button', { name: /Confirm & Mark Lost/i });
    expect(confirmButton).toBeDisabled();
  });

  it('displays all loss reason options', async () => {
    const user = userEvent.setup();
    
    render(
      <LostReasonModal
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    // Open the dropdown
    const select = screen.getByLabelText(/Loss Reason/i);
    await user.click(select);

    // Check all options are present
    expect(screen.getByRole('option', { name: /Price\/Budget/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Timing\/Postponed/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Qualification\/Not a fit/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Competitor/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /No response/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Other/i })).toBeInTheDocument();
  });
});


