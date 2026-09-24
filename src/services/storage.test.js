import { describe, it, expect } from 'vitest';
import {
  migrateStorage,
  getUser,
  saveUser,
  getSession,
  saveSession,
  clearSession,
  loadJobs,
  saveJobs,
  claimUnclaimedJobs,
  SCHEMA_VERSION,
} from './storage';

const job = (id, title) => ({
  id,
  title,
  company: 'Co',
  location: '',
  status: 'Applied',
  appliedDate: '2026-01-01',
  interviewDate: '',
  interviewTime: '',
});

describe('storage', () => {
  it('keeps each account’s jobs under its own key', () => {
    saveJobs('a@example.com', [job(1, 'A')]);
    saveJobs('b@example.com', [job(2, 'B')]);

    expect(loadJobs('a@example.com').map((j) => j.title)).toEqual(['A']);
    expect(loadJobs('b@example.com').map((j) => j.title)).toEqual(['B']);
  });

  it('treats emails case-insensitively', () => {
    saveUser({ email: ' Me@Example.com ', passwordHash: 'x', salt: 'y' });
    expect(getUser('me@example.com').email).toBe('me@example.com');
    saveJobs('ME@example.com', [job(1, 'A')]);
    expect(loadJobs('me@example.com')).toHaveLength(1);
  });

  it('returns an empty list when nothing or something broken is saved', () => {
    expect(loadJobs('nobody@example.com')).toEqual([]);
    localStorage.setItem('jobTracker.jobs.broken@example.com', '{not json');
    expect(loadJobs('broken@example.com')).toEqual([]);
  });

  it('only restores a session for an account that exists', () => {
    saveSession('ghost@example.com');
    expect(getSession()).toBeNull();

    saveUser({ email: 'me@example.com', passwordHash: 'x', salt: 'y' });
    saveSession('me@example.com');
    expect(getSession()).toEqual({ email: 'me@example.com' });

    clearSession();
    expect(getSession()).toBeNull();
  });

  describe('migrateStorage', () => {
    it('moves version 1 data into the account layout', () => {
      localStorage.setItem('user', JSON.stringify({ email: 'Old@Example.com', password: 'pw' }));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem(
        'jobs',
        JSON.stringify([
          { id: 1, title: 'Old', company: 'Co', status: 'Accepted', date: '2026-01-02' },
        ]),
      );

      migrateStorage();

      expect(getUser('old@example.com')).toMatchObject({ legacyPassword: 'pw' });
      expect(getSession()).toEqual({ email: 'old@example.com' });
      expect(loadJobs('old@example.com')[0]).toMatchObject({
        title: 'Old',
        status: 'Offer',
        appliedDate: '2026-01-02',
      });
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('jobs')).toBeNull();
      expect(localStorage.getItem('isLoggedIn')).toBeNull();
      expect(localStorage.getItem('jobTracker.version')).toBe(String(SCHEMA_VERSION));
    });

    it('does not log anyone in who was logged out', () => {
      localStorage.setItem('user', JSON.stringify({ email: 'a@example.com', password: 'pw' }));
      localStorage.setItem('isLoggedIn', 'false');
      migrateStorage();
      expect(getSession()).toBeNull();
    });

    it('keeps jobs without an account for the next person who registers', () => {
      localStorage.setItem('jobs', JSON.stringify([job(5, 'Waiting')]));
      migrateStorage();

      claimUnclaimedJobs('new@example.com');
      expect(loadJobs('new@example.com').map((j) => j.title)).toEqual(['Waiting']);

      claimUnclaimedJobs('later@example.com');
      expect(loadJobs('later@example.com')).toEqual([]);
    });

    it('runs only once', () => {
      migrateStorage();
      localStorage.setItem('user', JSON.stringify({ email: 'late@example.com', password: 'pw' }));
      migrateStorage();
      expect(getUser('late@example.com')).toBeNull();
    });
  });
});
