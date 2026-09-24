import { describe, it, expect } from 'vitest';
import { migrateJob } from './migrateJob';

describe('migrateJob', () => {
  it('moves the old date field to appliedDate', () => {
    const job = migrateJob({
      id: 1,
      title: 'Dev',
      company: 'Co',
      status: 'Applied',
      date: '2026-01-15',
    });
    expect(job.appliedDate).toBe('2026-01-15');
    expect(job.interviewDate).toBe('');
    expect(job).not.toHaveProperty('date');
  });

  it('treats the old date as the interview date for jobs in the Interview stage', () => {
    const job = migrateJob({
      id: 1,
      status: 'Interview',
      date: '2026-01-20',
      interviewTime: '10:00',
    });
    expect(job.interviewDate).toBe('2026-01-20');
    expect(job.interviewTime).toBe('10:00');
  });

  it("renames the old 'Accepted' status to 'Offer'", () => {
    expect(migrateJob({ id: 1, status: 'Accepted' }).status).toBe('Offer');
  });

  it('fills in missing fields', () => {
    expect(migrateJob({ id: 1 })).toEqual({
      id: 1,
      title: '',
      company: '',
      location: '',
      status: 'Applied',
      appliedDate: '',
      interviewDate: '',
      interviewTime: '',
    });
  });

  it('leaves jobs that are already up to date unchanged', () => {
    const job = {
      id: 1,
      title: 'Dev',
      company: 'Co',
      location: 'Toronto',
      status: 'Offer',
      appliedDate: '2026-01-01',
      interviewDate: '2026-01-10',
      interviewTime: '09:00',
    };
    expect(migrateJob(job)).toEqual(job);
  });
});
