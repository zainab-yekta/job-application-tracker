import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

function Broken() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows its children when nothing goes wrong', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('shows a recovery page instead of a blank screen', async () => {
    // React and the boundary both log the error; keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText(/saved applications are safe/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload the page' })).toBeInTheDocument();
  });

  it('tries again when the page changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(
      <ErrorBoundary resetKey="/analytics">
        <Broken />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKey="/dashboard">
        <p>Dashboard</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('reloads the page when asked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, reload });
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Reload the page' }));
    expect(reload).toHaveBeenCalled();
  });
});
