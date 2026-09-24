import { describe, it, expect } from 'vitest';
import { getBotReply } from './chatbotReplies';

describe('getBotReply', () => {
  it('ignores case and punctuation', () => {
    expect(getBotReply('HELLO!!')).toBe(getBotReply('hello'));
  });

  it('answers questions by keyword', () => {
    expect(getBotReply('How do I export to Excel?')).toMatch(/Export to Excel/);
    expect(getBotReply('where is my data stored')).toMatch(/your own browser/);
    expect(getBotReply('can I get a reminder for interviews')).toMatch(/reminder/);
    expect(getBotReply('How do I move my data to another browser?')).toMatch(/Restore backup/);
  });

  it('does not treat words that start with "hi" as a greeting', () => {
    expect(getBotReply('hire')).toMatch(/don't understand/);
  });

  it('falls back to a helpful message', () => {
    expect(getBotReply('qwerty')).toMatch(/Try asking about/);
  });
});
