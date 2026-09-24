import { useState } from 'react';
import {
  migrateStorage,
  getUser,
  saveUser,
  getSession,
  saveSession,
  clearSession,
  claimUnclaimedJobs,
  normalizeEmail,
} from '../services/storage';
import { createSalt, hashPassword, verifyPassword } from '../utils/password';

export const MIN_PASSWORD_LENGTH = 6;

function loadSessionUser() {
  migrateStorage();
  return getSession()?.email ?? null;
}

// Demo accounts stored in this browser. `user` is the logged in email or null.
export function useAuth() {
  const [user, setUser] = useState(loadSessionUser);

  // Returns an error message, or null when the account was created
  const register = async (email, password) => {
    const normalized = normalizeEmail(email);
    if (!normalized) return 'Enter your email.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Use at least ${MIN_PASSWORD_LENGTH} characters for the password.`;
    }
    if (getUser(normalized)) return 'An account with this email already exists. Log in instead.';

    const salt = createSalt();
    const passwordHash = await hashPassword(password, salt);
    if (!saveUser({ email: normalized, salt, passwordHash, createdAt: Date.now() })) {
      return 'Your browser did not allow saving the account. Check that site storage is enabled.';
    }
    claimUnclaimedJobs(normalized);
    return null;
  };

  // Returns an error message, or null when logged in
  const login = async (email, password) => {
    const account = getUser(email);
    if (!account) return 'The email or password is not correct.';

    let valid;
    if (account.passwordHash) {
      valid = await verifyPassword(password, account.salt, account.passwordHash);
    } else {
      // Account created by an older version with a plain text password: check it
      // once, then replace it with a hash
      valid = account.legacyPassword === password;
      if (valid) {
        const salt = createSalt();
        saveUser({
          email: account.email,
          salt,
          passwordHash: await hashPassword(password, salt),
          createdAt: account.createdAt,
        });
      }
    }
    if (!valid) return 'The email or password is not correct.';

    saveSession(account.email);
    setUser(account.email);
    return null;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return { user, isLoggedIn: user !== null, register, login, logout };
}
