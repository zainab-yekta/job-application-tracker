import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbot from './Chatbot';

describe('Chatbot', () => {
  it('opens from the round button and greets the visitor', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);

    const toggle = screen.getByRole('button', { name: 'Open help chat' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);

    expect(screen.getByRole('region', { name: 'Help chat' })).toBeInTheDocument();
    expect(screen.getByText(/Ask me how to add a job/)).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toHaveFocus();
  });

  it('answers a quick question with one tap and then hides the suggestions', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: 'Open help chat' }));

    await user.click(screen.getByRole('button', { name: 'How do I export?' }));

    expect(screen.getByText(/Export to Excel or Export to PDF/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Interview reminders' })).not.toBeInTheDocument();
  });

  it('answers typed questions', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: 'Open help chat' }));

    await user.type(screen.getByLabelText('Message'), 'where is my data?{Enter}');

    expect(screen.getByText(/saved in your own browser/)).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toHaveValue('');
  });

  it('closes with Escape and returns focus to the chat button', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: 'Open help chat' }));

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('region', { name: 'Help chat' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open help chat' })).toHaveFocus();
  });
});
