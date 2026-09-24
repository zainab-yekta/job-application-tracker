// Every read and write to localStorage goes through this module. Components and
// hooks never touch localStorage directly, so the app could switch to a server
// API later by changing only this file.
//
// Layout (schema version 2):
//   jobTracker.version        "2"
//   jobTracker.users          { [email]: { email, salt, passwordHash, createdAt } }
//   jobTracker.session        { email } of the logged in user
//   jobTracker.jobs.<email>   that user's applications
//   jobTracker.theme          "light" or "dark" when the visitor picked one
//   jobTracker.unclaimedJobs  jobs saved before accounts had their own lists,
//                             given to the next account that registers
import { migrateJob } from '../utils/migrateJob';

export const SCHEMA_VERSION = 2;

const PREFIX = 'jobTracker';
const KEYS = {
  version: `${PREFIX}.version`,
  users: `${PREFIX}.users`,
  session: `${PREFIX}.session`,
  unclaimedJobs: `${PREFIX}.unclaimedJobs`,
  theme: `${PREFIX}.theme`,
  jobs: (email) => `${PREFIX}.jobs.${email}`,
};

// Keys used by version 1 of the app
const LEGACY_KEYS = { user: 'user', jobs: 'jobs', isLoggedIn: 'isLoggedIn' };

export const normalizeEmail = (email) => (email || '').trim().toLowerCase();

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Storage is full or blocked (for example in some private browsing modes)
    return false;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do if storage is blocked
  }
}

// Moves data saved by version 1 into the version 2 layout. Safe to call often:
// it does nothing once the stored version is current.
export function migrateStorage() {
  if (read(KEYS.version, 0) >= SCHEMA_VERSION) return;

  const legacyUser = read(LEGACY_KEYS.user, null);
  const legacyJobs = read(LEGACY_KEYS.jobs, []);
  const legacyLoggedIn = read(LEGACY_KEYS.isLoggedIn, false) === true;
  const jobs = Array.isArray(legacyJobs) ? legacyJobs.map(migrateJob) : [];
  const email = normalizeEmail(legacyUser?.email);

  if (email) {
    const users = read(KEYS.users, {});
    if (!users[email]) {
      // Version 1 kept the password as plain text. It is hashed the first time
      // this user logs in (see useAuth) and the plain copy is removed then.
      users[email] = { email, legacyPassword: legacyUser.password || '', createdAt: Date.now() };
      write(KEYS.users, users);
    }
    if (jobs.length > 0 && read(KEYS.jobs(email), null) === null) write(KEYS.jobs(email), jobs);
    if (legacyLoggedIn) write(KEYS.session, { email });
  } else if (jobs.length > 0) {
    write(KEYS.unclaimedJobs, jobs);
  }

  remove(LEGACY_KEYS.user);
  remove(LEGACY_KEYS.jobs);
  remove(LEGACY_KEYS.isLoggedIn);
  write(KEYS.version, SCHEMA_VERSION);
}

// Accounts

export function getUser(email) {
  return read(KEYS.users, {})[normalizeEmail(email)] || null;
}

export function saveUser(user) {
  const users = read(KEYS.users, {});
  const email = normalizeEmail(user.email);
  users[email] = { ...user, email };
  return write(KEYS.users, users);
}

// Session

export function getSession() {
  const session = read(KEYS.session, null);
  return session?.email && getUser(session.email) ? session : null;
}

export function saveSession(email) {
  return write(KEYS.session, { email: normalizeEmail(email) });
}

export function clearSession() {
  remove(KEYS.session);
}

// Jobs

export function loadJobs(email) {
  if (!email) return [];
  const jobs = read(KEYS.jobs(normalizeEmail(email)), []);
  return Array.isArray(jobs) ? jobs.map(migrateJob) : [];
}

export function saveJobs(email, jobs) {
  if (!email) return false;
  return write(KEYS.jobs(normalizeEmail(email)), jobs);
}

// Hands jobs saved before accounts existed to a newly registered account
export function claimUnclaimedJobs(email) {
  const jobs = read(KEYS.unclaimedJobs, []);
  if (!Array.isArray(jobs) || jobs.length === 0) return;
  saveJobs(email, [...loadJobs(email), ...jobs.map(migrateJob)]);
  remove(KEYS.unclaimedJobs);
}

// Theme (index.html also reads this key before the app starts, to avoid a flash)

export function getThemePreference() {
  const theme = read(KEYS.theme, null);
  return theme === 'light' || theme === 'dark' ? theme : null;
}

export function saveThemePreference(theme) {
  return write(KEYS.theme, theme);
}
