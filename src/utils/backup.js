// Backup files let people move their applications to another browser or keep a
// copy. The file is plain JSON:
//   { app: 'job-application-tracker', schemaVersion: 2, exportedAt, jobs: [...] }
import { STATUSES } from '../constants/statuses';
import { SCHEMA_VERSION } from '../services/storage';
import { migrateJob } from './migrateJob';

export const APP_ID = 'job-application-tracker';
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const MAX_JOBS = 5000;
const MAX_TEXT_LENGTH = 200;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export function createBackup(jobs, now = new Date()) {
  return { app: APP_ID, schemaVersion: SCHEMA_VERSION, exportedAt: now.toISOString(), jobs };
}

export function backupFileName(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `job-tracker-backup-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;
}

export function downloadBackup(jobs) {
  const blob = new Blob([JSON.stringify(createBackup(jobs), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = backupFileName();
  link.click();
  URL.revokeObjectURL(url);
}

// Checks one job from a file and returns a clean copy with only known fields.
// Throws an Error with a message people can act on.
function cleanJob(raw, position, usedIds) {
  const where = `Application ${position}`;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`${where} is not in the right format.`);
  }

  const job = migrateJob(raw);
  for (const field of [
    'title',
    'company',
    'location',
    'status',
    'appliedDate',
    'interviewDate',
    'interviewTime',
  ]) {
    if (typeof job[field] !== 'string') throw new Error(`${where} has an invalid ${field}.`);
  }
  if (!job.title.trim()) throw new Error(`${where} has no job title.`);
  if (!job.company.trim()) throw new Error(`${where} has no company.`);
  for (const field of ['title', 'company', 'location']) {
    if (job[field].length > MAX_TEXT_LENGTH) {
      throw new Error(`${where} has a ${field} that is too long.`);
    }
  }
  if (!STATUSES.includes(job.status)) {
    throw new Error(`${where} has an unknown status "${job.status}".`);
  }
  for (const field of ['appliedDate', 'interviewDate']) {
    if (job[field] && !DATE_PATTERN.test(job[field])) {
      throw new Error(`${where} has a date that is not YYYY-MM-DD.`);
    }
  }
  if (job.interviewTime && !TIME_PATTERN.test(job.interviewTime)) {
    throw new Error(`${where} has an interview time that is not HH:MM.`);
  }

  let id = typeof job.id === 'number' || typeof job.id === 'string' ? job.id : null;
  if (id === null || usedIds.has(id)) id = `${Date.now()}-${position}`;
  usedIds.add(id);

  return {
    id,
    title: job.title.trim(),
    company: job.company.trim(),
    location: job.location.trim(),
    status: job.status,
    appliedDate: job.appliedDate,
    interviewDate: job.interviewDate,
    interviewTime: job.interviewTime,
  };
}

// Reads the text of a backup file and returns its jobs, or throws an Error
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('This file is not a valid backup. Choose a .json file saved from this app.');
  }

  // Accept this app's backup format, or a bare list of jobs
  let jobs;
  if (Array.isArray(data)) {
    jobs = data;
  } else if (data && typeof data === 'object' && Array.isArray(data.jobs)) {
    if (data.app && data.app !== APP_ID) {
      throw new Error('This backup was made by a different app.');
    }
    if (Number(data.schemaVersion) > SCHEMA_VERSION) {
      throw new Error('This backup was made by a newer version of the app.');
    }
    jobs = data.jobs;
  } else {
    throw new Error('This file does not contain any applications.');
  }

  if (jobs.length > MAX_JOBS) {
    throw new Error(`A backup can hold at most ${MAX_JOBS} applications.`);
  }

  const usedIds = new Set();
  return jobs.map((job, index) => cleanJob(job, index + 1, usedIds));
}
