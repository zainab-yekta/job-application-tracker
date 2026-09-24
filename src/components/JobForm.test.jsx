import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobForm from './JobForm';

const fillRequired = async (user) => {
  await user.type(screen.getByLabelText('Job title'), '  Frontend Developer ');
  await user.type(screen.getByLabelText('Company'), 'Shopify');
  await user.type(screen.getByLabelText('Applied on'), '2026-05-01');
};

describe('JobForm', () => {
  it('shows every missing field instead of submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<JobForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Add application' }));

    expect(onSubmit).not.toHaveBeenCalled();
    // Each message sits under its own field and is announced with it
    const title = screen.getByLabelText('Job title');
    expect(title).toBeInvalid();
    expect(title).toHaveAccessibleDescription('Enter the job title.');
    expect(screen.getByLabelText('Company')).toHaveAccessibleDescription('Enter the company name.');
    expect(screen.getByLabelText('Applied on')).toHaveAccessibleDescription(
      'Pick the date you applied.',
    );
    // Focus moves to the first field that needs fixing
    expect(title).toHaveFocus();
  });

  it('clears a field error as soon as that field is edited', async () => {
    const user = userEvent.setup();
    render(<JobForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Add application' }));
    await user.type(screen.getByLabelText('Job title'), 'Dev');

    expect(screen.getByLabelText('Job title')).not.toBeInvalid();
    expect(screen.queryByText('Enter the job title.')).not.toBeInTheDocument();
    expect(screen.getByText('Enter the company name.')).toBeInTheDocument();
  });

  it('submits a trimmed job and clears the form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<JobForm onSubmit={onSubmit} />);

    await fillRequired(user);
    await user.click(screen.getByRole('button', { name: 'Add application' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Frontend Developer',
        company: 'Shopify',
        appliedDate: '2026-05-01',
        status: 'Applied',
        interviewDate: '',
      }),
    );
    expect(screen.getByLabelText('Job title')).toHaveValue('');
  });

  it('asks for the interview date and time when the status is Interview', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<JobForm onSubmit={onSubmit} />);

    await fillRequired(user);
    await user.selectOptions(screen.getByLabelText('Status'), 'Interview');
    await user.click(screen.getByRole('button', { name: 'Add application' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Interview time')).toHaveAccessibleDescription(
      'Pick the interview time.',
    );

    await user.type(screen.getByLabelText('Interview date'), '2026-05-10');
    await user.type(screen.getByLabelText('Interview time'), '14:30');
    await user.click(screen.getByRole('button', { name: 'Add application' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ interviewDate: '2026-05-10', interviewTime: '14:30' }),
    );
  });

  it('loads the job being edited and can cancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const job = {
      id: 7,
      title: 'UI Engineer',
      company: 'Slack',
      location: '',
      status: 'Offer',
      appliedDate: '2026-04-01',
      interviewDate: '2026-04-10',
      interviewTime: '09:00',
    };
    render(<JobForm jobToEdit={job} onSubmit={vi.fn()} onCancel={onCancel} />);

    expect(screen.getByLabelText('Job title')).toHaveValue('UI Engineer');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
