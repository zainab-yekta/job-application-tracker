import { useEffect, useState, useSyncExternalStore } from 'react';
import { getThemePreference, saveThemePreference } from '../services/storage';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const subscribe = (onChange) => {
  const media = window.matchMedia?.(DARK_QUERY);
  media?.addEventListener('change', onChange);
  return () => media?.removeEventListener('change', onChange);
};

const systemPrefersDark = () => Boolean(window.matchMedia?.(DARK_QUERY).matches);

// Light or dark theme. Follows the system setting until the visitor picks one.
export function useTheme() {
  const [choice, setChoice] = useState(getThemePreference);
  const systemDark = useSyncExternalStore(subscribe, systemPrefersDark, () => false);
  const theme = choice ?? (systemDark ? 'dark' : 'light');

  // Keep the page in sync with the theme (the colors live in styles/tokens.css)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    saveThemePreference(next);
    setChoice(next);
  };

  return { theme, toggleTheme };
}
