import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { acceptInvite, getSettings, getUser, handleAuthCallback, logout, oauthLogin, onAuthChange } from '@netlify/identity';
import { createAuthSession, savedPcIds, type AuthState } from './session';
import { createProfileTransport, readIdentitySessionCookie } from './profile';
import { AUTH_HASH_KEYS, consumeAuthCallback } from './callback';

const profile = createProfileTransport({ origin: () => window.location.origin, readSessionCookie: readIdentitySessionCookie, fetch: (...args) => fetch(...args) });
const service = { acceptInvite, getSettings, getUser, handleAuthCallback, logout, oauthLogin, onAuthChange, ...profile };
type Session = ReturnType<typeof createAuthSession>;
type AuthContextValue = AuthState & Omit<Session, 'start' | 'stop' | 'subscribe' | 'getSnapshot'> & {
  enabled: boolean;
  googleEnabled: boolean;
  savedPcIds: string[];
};
const AuthContext = createContext<AuthContextValue | null>(null);
const accountsEnabled = import.meta.env.VITE_CUSTOMER_ACCOUNTS === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useMemo(() => createAuthSession({
    ...service,
    handleAuthCallback: () => consumeAuthCallback(service.handleAuthCallback, window.location, url => window.history.replaceState(null, '', url)),
  }, 15000, accountsEnabled), []);
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (!accountsEnabled) {
      if (AUTH_HASH_KEYS.some(key => hash.has(key))) window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return;
    }
    // Provider and emailed callbacks can arrive on the home page. Complete them on the account page.
    if (window.location.pathname !== '/account' && AUTH_HASH_KEYS.some(key => hash.has(key))) {
      window.location.replace('/account' + window.location.hash);
      return;
    }
    void session.start();
    return session.stop;
  }, [session]);

  return <AuthContext.Provider value={{ ...state, ...session, enabled: accountsEnabled, googleEnabled: Boolean(state.settings?.providers.google), savedPcIds: savedPcIds(state.user) }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth requires AuthProvider');
  return value;
}
