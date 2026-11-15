import type { CallbackResult, Settings, User } from '@netlify/identity';
import { CustomerProfileError } from './profile.ts';
import { SAFE_PC_ID } from './shortlist.ts';
export { MAX_SAVED_PCS, savedPcIds, safeReturnPath } from './shortlist.ts';

export type AuthService = {
  getSettings: () => Promise<Settings>;
  getUser: () => Promise<User | null>;
  getProfile: (user: User) => Promise<User>;
  changeShortlist: (user: User, id: string, save: boolean) => Promise<User>;
  changePassword: (user: User, password: string) => Promise<User>;
  handleAuthCallback: () => Promise<CallbackResult | null>;
  onAuthChange: (callback: (event: string, user: User | null) => void) => () => void;
  oauthLogin: (provider: 'google') => never;
  logout: () => Promise<void>;
  acceptInvite: (token: string, password: string) => Promise<User>;
};

export type AuthState = {
  loading: boolean;
  serviceStatus: 'checking' | 'available' | 'unavailable';
  profileStatus: 'checking' | 'ready' | 'unavailable' | 'none';
  settings: Settings | null;
  user: User | null;
  error: string | null;
  pending: 'save' | 'logout' | 'invite' | 'password' | null;
  callback: { type: 'invite'; token: string } | { type: 'recovery' } | null;
};

class AccountChangedError extends Error {}
const validIdentity = (user: User | null): user is User => Boolean(user && typeof user.id === 'string' && user.id.trim() && user.id.length <= 200);

export function createAuthSession(service: AuthService, timeoutMs = 15000, enabled = true) {
  let state: AuthState = { loading: enabled, serviceStatus: enabled ? 'checking' : 'unavailable', profileStatus: 'none', settings: null, user: null, error: null, pending: null, callback: null };
  let version = 0;
  let profileRequest = 0;
  let unsubscribe: (() => void) | null = null;
  let bootstrap: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  const set = (patch: Partial<AuthState>) => { state = { ...state, ...patch }; listeners.forEach(listener => listener()); };
  const setUser = (user: User | null) => {
    if (state.user?.id !== user?.id) version += 1;
    set({ user });
  };
  const bounded = <T,>(promise: Promise<T>): Promise<T> => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out')), timeoutMs);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
  const accountMatches = (userId: string, expectedVersion: number) => {
    if (state.user?.id !== userId || version !== expectedVersion) throw new AccountChangedError();
  };
  const operationMessage = (error: unknown, fallback: string) => {
    if (error instanceof CustomerProfileError && error.code === 'expired') return 'Your sign-in expired. Continue with Google to sign in again.';
    if (error instanceof AccountChangedError || (error instanceof CustomerProfileError && error.code === 'account-changed')) return 'Your sign-in changed. Check your account and try again.';
    return fallback;
  };
  const expire = (userId: string, error: unknown) => {
    if (state.user?.id === userId && error instanceof CustomerProfileError && error.code === 'expired') {
      setUser(null);
      set({ profileStatus: 'none', callback: null });
    }
  };
  const displayIdentity = (user: User | null) => {
    if (!validIdentity(user)) { profileRequest += 1; setUser(null); set({ profileStatus: 'none' }); return; }
    // SDK profile metadata is cached. Never use it as the saved-PC source of truth.
    if (state.user?.id !== user.id) {
      setUser({ ...user, userMetadata: { ...user.userMetadata, saved_pcs: [] } });
      set({ profileStatus: 'checking' });
    }
  };
  const refreshProfile = async (user: User) => {
    const request = ++profileRequest;
    const expectedVersion = version;
    try {
      const profile = await bounded(service.getProfile(user));
      if (request !== profileRequest) return;
      accountMatches(user.id, expectedVersion);
      setUser(profile); set({ profileStatus: 'ready' });
    } catch (error) {
      if (request !== profileRequest || state.user?.id !== user.id) return;
      expire(user.id, error);
      set({ profileStatus: state.user ? 'unavailable' : 'none', error: operationMessage(error, 'We couldn’t load your saved PCs. Please refresh and try again.') });
    }
  };

  const start = () => {
    if (!enabled) return Promise.resolve();
    if (!unsubscribe) unsubscribe = service.onAuthChange((event, user) => {
      if ((event === 'user_updated' || event === 'token_refresh') && user?.id !== state.user?.id) return;
      if (event === 'login' || event === 'logout') set({ error: null, callback: null });
      displayIdentity(user);
      if (validIdentity(user) && (!state.pending || event === 'login')) void refreshProfile(user);
    });
    if (!bootstrap) bootstrap = (async () => {
      let callbackError = false;
      try {
        const result = await bounded(service.handleAuthCallback());
        if (result?.type === 'invite' && result.token) set({ callback: { type: 'invite', token: result.token } });
        if (result?.type === 'recovery') set({ callback: { type: 'recovery' } });
      } catch { callbackError = true; }
      const before = version;
      const [user, settings] = await Promise.allSettled([bounded(service.getUser()), bounded(service.getSettings())]);
      if (user.status === 'fulfilled' && version === before) {
        displayIdentity(user.value);
        if (validIdentity(user.value)) await refreshProfile(user.value);
      }
      set({ loading: false, settings: settings.status === 'fulfilled' ? settings.value : null, serviceStatus: settings.status === 'fulfilled' ? 'available' : 'unavailable', ...(callbackError ? { error: 'We couldn’t finish signing you in. Please try again.' } : {}) });
    })();
    return bootstrap;
  };

  const retry = () => {
    if (!enabled || state.loading || state.pending) return Promise.resolve();
    // A retry checks the service and the current account again. It never reuses
    // cached profile metadata as a successful saved-PC response.
    profileRequest += 1;
    bootstrap = null;
    set({ loading: true, serviceStatus: 'checking', profileStatus: state.user ? 'checking' : 'none', settings: null, error: null });
    return start();
  };

  const mutateShortlist = async (id: string, save: boolean) => {
    if (!SAFE_PC_ID.test(id)) throw new Error('This PC could not be saved.');
    if (!state.user) throw new Error('Sign in to save PCs.');
    if (state.pending) throw new Error('Please wait for your current change to finish.');
    const userId = state.user.id;
    const expectedVersion = version;
    profileRequest += 1;
    set({ pending: 'save', error: null });
    try {
      const current = await bounded(service.getUser());
      accountMatches(userId, expectedVersion);
      if (current?.id !== userId) throw new AccountChangedError();
      // Transport fresh-reads /user and writes with one immutable account credential.
      const updated = await bounded(service.changeShortlist(current, id, save));
      const after = await bounded(service.getUser());
      accountMatches(userId, expectedVersion);
      if (updated.id !== userId || after?.id !== userId) throw new AccountChangedError();
      setUser(updated); set({ profileStatus: 'ready' });
    } catch (error) {
      const message = error instanceof Error && error.message.startsWith('Your shortlist is full.') ? error.message : operationMessage(error, 'We couldn’t confirm your saved PCs. Please try again.');
      const sameAccount = state.user?.id === userId;
      expire(userId, error);
      if (sameAccount) set({ error: message });
      throw new Error(message);
    } finally { set({ pending: null }); }
  };

  const signOut = async () => {
    if (state.pending) return;
    const userId = state.user?.id;
    const expectedVersion = version;
    set({ pending: 'logout', error: null });
    try {
      await bounded(service.logout());
      if (version === expectedVersion && state.user?.id === userId) displayIdentity(null);
      set({ callback: null });
    } catch {
      set({ error: 'We couldn’t finish signing you out. Please try again.' });
      throw new Error('Sign-out was not confirmed.');
    } finally { set({ pending: null }); }
  };

  const completePassword = async (password: string, invite: boolean) => {
    if (state.pending) return;
    if (password.length < 10) throw new Error('Use at least 10 characters for your password.');
    const callback = state.callback;
    const userId = state.user?.id;
    const expectedVersion = version;
    if (invite && callback?.type !== 'invite') throw new Error('This invitation is no longer available.');
    set({ pending: invite ? 'invite' : 'password', error: null });
    try {
      let updated: User;
      if (invite && callback?.type === 'invite') updated = await bounded(service.acceptInvite(callback.token, password));
      else {
        const current = await bounded(service.getUser());
        if (!current || current.id !== userId || version !== expectedVersion) throw new AccountChangedError();
        updated = await bounded(service.changePassword(current, password));
        accountMatches(current.id, expectedVersion);
      }
      setUser(updated);
      set({ callback: null });
      await refreshProfile(updated);
    } catch (error) {
      const message = operationMessage(error, 'We couldn’t save your password. Please try the link again.');
      if (userId) expire(userId, error);
      set({ error: message }); throw new Error(message);
    } finally { set({ pending: null }); }
  };

  return {
    start,
    retry,
    stop: () => { unsubscribe?.(); unsubscribe = null; },
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    clearError: () => set({ error: null }),
    signInWithGoogle: () => {
      if (!state.settings?.providers.google) return;
      set({ error: null });
      try { service.oauthLogin('google'); }
      catch (error) {
        if (error instanceof Error && error.name === 'AuthError' && error.message === 'Redirecting to OAuth provider') return;
        set({ error: 'Google sign-in couldn’t start. Please try again.' });
      }
    },
    signOut,
    savePc: (id: string) => mutateShortlist(id, true),
    removePc: (id: string) => mutateShortlist(id, false),
    completeInvite: (password: string) => completePassword(password, true),
    completeRecovery: (password: string) => completePassword(password, false),
  };
}
