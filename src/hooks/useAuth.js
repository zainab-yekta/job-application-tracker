import { useState, useEffect } from 'react';

const SESSION_KEY = 'isLoggedIn';

// Remembers whether the demo user is logged in, so a page refresh keeps the session
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem(SESSION_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, String(isLoggedIn));
  }, [isLoggedIn]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return { isLoggedIn, login, logout };
}
