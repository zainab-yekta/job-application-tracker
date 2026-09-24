import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange) => {
  const media = window.matchMedia?.(QUERY);
  media?.addEventListener('change', onChange);
  return () => media?.removeEventListener('change', onChange);
};

const getSnapshot = () => Boolean(window.matchMedia?.(QUERY).matches);

// True when the visitor asked their system for less motion. Used to switch off
// chart animations, which CSS alone cannot reach.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
