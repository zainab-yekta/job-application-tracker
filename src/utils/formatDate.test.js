import { describe, it, expect } from 'vitest';
import { parseLocalDate, formatDisplayDate } from './formatDate';

describe('parseLocalDate', () => {
  it('reads YYYY-MM-DD as a local date, not UTC', () => {
    const date = parseLocalDate('2026-03-05');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(5);
    expect(date.getHours()).toBe(0);
  });

  it('adds the time when one is given', () => {
    const date = parseLocalDate('2026-03-05', '14:30');
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(30);
  });

  it('returns null for missing or broken input', () => {
    expect(parseLocalDate('')).toBeNull();
    expect(parseLocalDate(undefined)).toBeNull();
    expect(parseLocalDate('not a date')).toBeNull();
  });
});

describe('formatDisplayDate', () => {
  it.each([
    ['2026-03-01', '1st March 2026'],
    ['2026-03-02', '2nd March 2026'],
    ['2026-03-03', '3rd March 2026'],
    ['2026-03-04', '4th March 2026'],
    ['2026-03-11', '11th March 2026'],
    ['2026-03-12', '12th March 2026'],
    ['2026-03-13', '13th March 2026'],
    ['2026-03-21', '21st March 2026'],
    ['2026-03-22', '22nd March 2026'],
    ['2026-03-31', '31st March 2026'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatDisplayDate(input)).toBe(expected);
  });

  it('shows N/A when there is no date', () => {
    expect(formatDisplayDate('')).toBe('N/A');
  });
});
