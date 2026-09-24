import { describe, it, expect } from 'vitest';
import { getUpcomingInterviews } from './reminders';

const interview = (id, interviewDate, interviewTime, status = 'Interview') => ({
  id,
  status,
  interviewDate,
  interviewTime,
});

describe('getUpcomingInterviews', () => {
  // Wednesday 10 June 2026, 12:00 local time
  const now = new Date(2026, 5, 10, 12, 0);

  it('includes interviews later today and any time tomorrow', () => {
    const jobs = [interview(1, '2026-06-10', '15:00'), interview(2, '2026-06-11', '23:30')];
    expect(getUpcomingInterviews(jobs, now).map((job) => job.id)).toEqual([1, 2]);
  });

  it('leaves out interviews that already happened', () => {
    const jobs = [interview(1, '2026-06-10', '09:00'), interview(2, '2026-06-09', '15:00')];
    expect(getUpcomingInterviews(jobs, now)).toEqual([]);
  });

  it('leaves out interviews more than a day away', () => {
    expect(getUpcomingInterviews([interview(1, '2026-06-12', '09:00')], now)).toEqual([]);
  });

  it('only looks at jobs still in the Interview stage', () => {
    const jobs = [interview(1, '2026-06-10', '15:00', 'Rejected')];
    expect(getUpcomingInterviews(jobs, now)).toEqual([]);
  });
});
