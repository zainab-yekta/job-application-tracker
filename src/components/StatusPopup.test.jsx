import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusPopup from './StatusPopup';

const job = (status) => ({ id: 1, title: 'UI Engineer', company: 'Slack', status });

describe('StatusPopup', () => {
  it('shows a dismissible toast for a new offer', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<StatusPopup job={job('Offer')} onClose={onClose} onDeleteAll={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('Congratulations on the offer!');
    expect(screen.getByRole('status')).toHaveTextContent('UI Engineer at Slack');
    await user.click(screen.getByRole('button', { name: 'Dismiss offer message' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('asks whether to keep or clear the list after accepting an offer', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onDeleteAll = vi.fn();
    render(<StatusPopup job={job('Accepted Offer')} onClose={onClose} onDeleteAll={onDeleteAll} />);

    const dialog = screen.getByRole('dialog', { name: 'You accepted the offer at Slack' });
    expect(dialog).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete all applications' }));
    expect(onDeleteAll).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Keep my list' }));
    expect(onClose).toHaveBeenCalled();
  });
});
