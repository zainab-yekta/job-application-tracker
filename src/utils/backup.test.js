import { describe, it, expect } from 'vitest';
import { createBackup, parseBackup, backupFileName, APP_ID } from './backup';

const job = (overrides) => ({
  id: 1,
  title: 'Frontend Developer',
  company: 'Shopify',
  location: 'Toronto',
  status: 'Interview',
  appliedDate: '2026-05-01',
  interviewDate: '2026-05-10',
  interviewTime: '14:30',
  ...overrides,
});

const backupText = (jobs, extra) => JSON.stringify({ ...createBackup(jobs), ...extra });

describe('backups', () => {
  it('round-trips jobs through a backup file', () => {
    const jobs = [job(), job({ id: 2, title: 'UI Engineer', status: 'Offer' })];
    expect(parseBackup(backupText(jobs))).toEqual(jobs);
  });

  it('labels the file with the app name and schema version', () => {
    const backup = createBackup([], new Date('2026-06-01T10:00:00Z'));
    expect(backup).toMatchObject({ app: APP_ID, schemaVersion: 2, jobs: [] });
    expect(backupFileName(new Date(2026, 5, 1))).toBe('job-tracker-backup-2026-06-01.json');
  });

  it('accepts a bare list of jobs in the old format', () => {
    const [imported] = parseBackup(
      JSON.stringify([
        { id: 9, title: 'Dev', company: 'Co', status: 'Applied', date: '2026-01-02' },
      ]),
    );
    expect(imported).toMatchObject({ id: 9, appliedDate: '2026-01-02', interviewDate: '' });
  });

  it('drops fields the app does not know about', () => {
    const [imported] = parseBackup(backupText([job({ isAdmin: true, notes: '<script>' })]));
    expect(imported).not.toHaveProperty('isAdmin');
    expect(imported).not.toHaveProperty('notes');
  });

  it('gives duplicate or missing ids new unique ids', () => {
    const imported = parseBackup(backupText([job({ id: 5 }), job({ id: 5 }), job({ id: null })]));
    const ids = imported.map((j) => j.id);
    expect(ids[0]).toBe(5);
    expect(new Set(ids).size).toBe(3);
  });

  it.each([
    ['not json at all', 'not a valid backup'],
    [JSON.stringify({ hello: 'world' }), 'does not contain any applications'],
    [JSON.stringify({ app: 'something-else', jobs: [] }), 'different app'],
    [JSON.stringify({ app: APP_ID, schemaVersion: 99, jobs: [] }), 'newer version'],
    [backupText([job({ title: '  ' })]), 'Application 1 has no job title'],
    [backupText([job(), job({ company: '' })]), 'Application 2 has no company'],
    [backupText([job({ status: 'Hired' })]), 'unknown status "Hired"'],
    [backupText([job({ appliedDate: '01/05/2026' })]), 'not YYYY-MM-DD'],
    [backupText([job({ interviewTime: '2pm' })]), 'not HH:MM'],
    [backupText([job({ title: 42 })]), 'invalid title'],
    [backupText([job({ title: 'x'.repeat(201) })]), 'too long'],
    [backupText(['just a string']), 'not in the right format'],
  ])('rejects a bad file: %s', (text, message) => {
    expect(() => parseBackup(text)).toThrow(message);
  });
});
