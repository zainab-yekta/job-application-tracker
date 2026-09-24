import { describe, it, expect } from 'vitest';
import { filterJobs } from './filterJobs';

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Shopify',
    status: 'Applied',
    appliedDate: '2026-05-01',
  },
  {
    id: 2,
    title: 'UI Engineer',
    company: 'Slack',
    status: 'Interview',
    appliedDate: '2026-05-02',
    interviewDate: '2026-05-10',
  },
  {
    id: 3,
    title: 'React Developer',
    company: 'Clio',
    status: 'Rejected',
    appliedDate: '2026-05-03',
  },
  { id: 4, company: 'No Title Inc', status: 'Applied', appliedDate: '2026-05-04' },
];

const ids = (list) => list.map((job) => job.id);

describe('filterJobs', () => {
  it('returns everything with no filters', () => {
    expect(ids(filterJobs(jobs))).toEqual([1, 2, 3, 4]);
  });

  it('filters by status', () => {
    expect(ids(filterJobs(jobs, { status: 'Applied' }))).toEqual([1, 4]);
  });

  it('searches title and company, ignoring case and spaces', () => {
    expect(ids(filterJobs(jobs, { search: '  developer ' }))).toEqual([1, 3]);
    expect(ids(filterJobs(jobs, { search: 'SLACK' }))).toEqual([2]);
  });

  it('handles jobs without a title', () => {
    expect(ids(filterJobs(jobs, { search: 'no title' }))).toEqual([4]);
  });

  it('matches the applied date or the interview date', () => {
    expect(ids(filterJobs(jobs, { date: '2026-05-03' }))).toEqual([3]);
    expect(ids(filterJobs(jobs, { date: '2026-05-10' }))).toEqual([2]);
  });

  it('combines filters', () => {
    expect(ids(filterJobs(jobs, { status: 'Applied', search: 'shop' }))).toEqual([1]);
  });
});
