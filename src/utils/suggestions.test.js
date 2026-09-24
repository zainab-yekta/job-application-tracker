import { describe, it, expect } from 'vitest';
import { getSuggestions } from './suggestions';

const counts = (overrides) => ({
  totalApplied: 0,
  appliedCount: 0,
  interviewCount: 0,
  rejectedCount: 0,
  offerCount: 0,
  ...overrides,
});

describe('getSuggestions', () => {
  it('returns nothing for an empty list', () => {
    expect(getSuggestions(counts())).toEqual([]);
  });

  it('suggests following up when four or more jobs are still Applied', () => {
    const tips = getSuggestions(counts({ totalApplied: 4, appliedCount: 4 }));
    expect(tips.some((tip) => tip.includes('following up'))).toBe(true);
  });

  it('flags a high rejection rate', () => {
    const tips = getSuggestions(counts({ totalApplied: 4, rejectedCount: 3, interviewCount: 1 }));
    expect(tips.some((tip) => tip.includes('high rejection rate'))).toBe(true);
  });

  it('can return several suggestions at once', () => {
    const tips = getSuggestions(counts({ totalApplied: 6, appliedCount: 6 }));
    expect(tips.length).toBeGreaterThan(1);
  });

  it('gives encouragement when there are interviews and offers', () => {
    const tips = getSuggestions(counts({ totalApplied: 3, interviewCount: 1, offerCount: 1 }));
    expect(tips.some((tip) => tip.includes('doing great'))).toBe(true);
  });
});
