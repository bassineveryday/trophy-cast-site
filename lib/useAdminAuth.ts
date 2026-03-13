import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'tc_admin_pw';

/**
 * Shared admin auth hook — stores the password in sessionStorage so navigating
 * between admin pages within a tab doesn't require re-entering the password.
 */
export function useAdminAuth() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        setPassword(saved);
        setUnlocked(true);
      }
    } catch {}
  }, []);

  const unlock = useCallback((pw: string) => {
    setPassword(pw);
    setUnlocked(true);
    setAuthError('');
    try { sessionStorage.setItem(SESSION_KEY, pw); } catch {}
  }, []);

  const lockOut = useCallback((msg = 'Wrong password. Try again.') => {
    setUnlocked(false);
    setPassword('');
    setAuthError(msg);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  return { password, unlocked, authError, setAuthError, unlock, lockOut };
}
