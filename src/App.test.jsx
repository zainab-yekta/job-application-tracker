import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const openAt = (hash) => {
  window.location.hash = hash;
  return render(<App />);
};

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('sends logged out visitors from the dashboard to the login page', async () => {
    openAt('#/dashboard');
    expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('keeps the session after a reload and shows saved jobs in the old format', async () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem(
      'jobs',
      JSON.stringify([
        { id: 1, title: 'Web Dev', company: 'Acme', status: 'Applied', date: '2026-02-03' },
      ]),
    );
    openAt('#/dashboard');

    expect(await screen.findByText('Web Dev')).toBeInTheDocument();
    expect(screen.getByText('Applied: 3rd February 2026')).toBeInTheDocument();
  });

  it('adds a job and saves it', async () => {
    const user = userEvent.setup();
    localStorage.setItem('isLoggedIn', 'true');
    openAt('#/dashboard');

    await user.type(screen.getByLabelText('Job title'), 'Frontend Developer');
    await user.type(screen.getByLabelText('Company'), 'Shopify');
    await user.type(screen.getByLabelText('Applied on'), '2026-05-01');
    await user.click(screen.getByRole('button', { name: 'Add Job' }));

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('jobs'));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ company: 'Shopify', appliedDate: '2026-05-01' });
  });

  it('logs in with the registered account', async () => {
    const user = userEvent.setup();
    localStorage.setItem('user', JSON.stringify({ email: 'me@example.com', password: 'secret1' }));
    openAt('#/login');

    await user.type(screen.getByLabelText('Email'), 'me@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(
      await screen.findByRole('heading', { name: 'Job Application Tracker' }),
    ).toBeInTheDocument();
  });
});
