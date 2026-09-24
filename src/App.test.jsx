import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const openAt = (hash) => {
  window.location.hash = hash;
  return render(<App />);
};

const register = async (user, email, password) => {
  await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: 'Sign up' }));
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Confirm password'), password);
  await user.click(screen.getByRole('button', { name: 'Create account' }));
  await screen.findByText('Account created. You can log in now.');
};

const login = async (user, password) => {
  // The email is filled in after registering
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: 'Log in' }));
  await screen.findByRole('heading', { name: 'Job Application Tracker' });
};

const addJob = async (user, title) => {
  await user.type(screen.getByLabelText('Job title'), title);
  await user.type(screen.getByLabelText('Company'), 'Acme');
  await user.type(screen.getByLabelText('Applied on'), '2026-05-01');
  await user.click(screen.getByRole('button', { name: 'Add Job' }));
};

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('shows a not found page for unknown addresses', async () => {
    openAt('#/no-such-page');
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to the home page' })).toBeInTheDocument();
  });

  it('sends logged out visitors from the dashboard to the login page', async () => {
    openAt('#/dashboard');
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('keeps each account’s jobs separate', async () => {
    const user = userEvent.setup();
    openAt('#/');

    await register(user, 'first@example.com', 'secret1');
    await login(user, 'secret1');
    await addJob(user, 'First User Job');
    expect(screen.getByText('First User Job')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Log out' }));
    await register(user, 'second@example.com', 'secret2');
    await login(user, 'secret2');
    expect(screen.queryByText('First User Job')).not.toBeInTheDocument();
    expect(screen.getByText('No job applications added yet.')).toBeInTheDocument();
  });

  it('refuses a second account with the same email', async () => {
    const user = userEvent.setup();
    openAt('#/');
    await register(user, 'me@example.com', 'secret1');

    await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: 'Sign up' }));
    await user.type(screen.getByLabelText('Email'), 'ME@example.com');
    await user.type(screen.getByLabelText('Password'), 'another1');
    await user.type(screen.getByLabelText('Confirm password'), 'another1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('already exists');
  });

  it('keeps the session after a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = openAt('#/');
    await register(user, 'me@example.com', 'secret1');
    await login(user, 'secret1');
    await addJob(user, 'Saved Job');
    unmount();

    openAt('#/dashboard');
    expect(await screen.findByText('Saved Job')).toBeInTheDocument();
  });

  it('replaces an old plain text password with a hash on first login', async () => {
    const user = userEvent.setup();
    localStorage.setItem('user', JSON.stringify({ email: 'old@example.com', password: 'oldpass' }));
    openAt('#/login');

    await user.type(screen.getByLabelText('Email'), 'old@example.com');
    await user.type(screen.getByLabelText('Password'), 'oldpass');
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    await screen.findByRole('heading', { name: 'Job Application Tracker' });

    const account = JSON.parse(localStorage.getItem('jobTracker.users'))['old@example.com'];
    expect(account.passwordHash).toMatch(/^[0-9a-f]{64}$/);
    expect(account).not.toHaveProperty('legacyPassword');
    const everythingStored = Array.from({ length: localStorage.length }, (_, i) =>
      localStorage.getItem(localStorage.key(i)),
    ).join('\n');
    expect(everythingStored).toContain('old@example.com');
    expect(everythingStored).not.toContain('oldpass');
  });

  it('upgrades data saved by the first version of the app', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'old@example.com', password: 'oldpass' }));
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
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('jobs')).toBeNull();
  });
});
