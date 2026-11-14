import type { User } from '@netlify/identity';
import { nextSavedPcIds } from './shortlist.ts';

export class CustomerProfileError extends Error {
  code: 'expired' | 'account-changed' | 'unavailable';
  constructor(code: 'expired' | 'account-changed' | 'unavailable') {
    super(code);
    this.name = 'CustomerProfileError';
    this.code = code;
  }
}

type TransportOptions = {
  origin: () => string;
  readSessionCookie: () => string | null;
  fetch: typeof fetch;
};

const metadata = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const optionalText = (value: unknown) => typeof value === 'string' && value ? value : undefined;

function normalizedUser(value: unknown, expectedId: string): User {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CustomerProfileError('unavailable');
  const data = value as Record<string, unknown>;
  if (data.id !== expectedId) throw new CustomerProfileError('account-changed');
  const userMetadata = metadata(data.user_metadata);
  const appMetadata = metadata(data.app_metadata);
  return {
    id: expectedId,
    email: optionalText(data.email),
    name: optionalText(userMetadata.full_name) || optionalText(userMetadata.name),
    pictureUrl: optionalText(userMetadata.avatar_url),
    roles: Array.isArray(appMetadata.roles) ? appMetadata.roles.filter((role): role is string => typeof role === 'string') : [],
    userMetadata,
    appMetadata,
  };
}

/** Reads fresh profile data without modifying the SDK's shared browser session. */
export function createProfileTransport(options: TransportOptions) {
  const capture = (user: User) => {
    const token = options.readSessionCookie();
    if (!token) throw new CustomerProfileError('expired');
    return { userId: user.id, token, endpoint: new URL('/.netlify/identity/user', options.origin()).href };
  };
  const request = async (credential: ReturnType<typeof capture>, method: 'GET' | 'PUT', body?: Record<string, unknown>): Promise<User> => {
    const stillCurrent = () => {
      if (options.readSessionCookie() !== credential.token) throw new CustomerProfileError('account-changed');
    };
    stillCurrent();
    let response: Response;
    try {
      response = await options.fetch(credential.endpoint, {
        method,
        credentials: 'omit',
        cache: 'no-store',
        headers: { Authorization: `Bearer ${credential.token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(12000),
      });
    } catch { throw new CustomerProfileError('unavailable'); }
    stillCurrent();
    if (response.status === 401 || response.status === 403) throw new CustomerProfileError('expired');
    if (!response.ok) throw new CustomerProfileError('unavailable');
    let data: unknown;
    try { data = await response.json(); } catch { throw new CustomerProfileError('unavailable'); }
    stillCurrent();
    return normalizedUser(data, credential.userId);
  };
  return {
    getProfile: (user: User) => request(capture(user), 'GET'),
    changeShortlist: async (user: User, id: string, save: boolean) => {
      const credential = capture(user);
      const current = await request(credential, 'GET');
      const next = nextSavedPcIds(current, id, save);
      return request(credential, 'PUT', { data: { ...current.userMetadata, saved_pcs: next } });
    },
    changePassword: async (user: User, password: string) => {
      const credential = capture(user);
      await request(credential, 'GET');
      return request(credential, 'PUT', { password });
    },
  };
}

export function readIdentitySessionCookie(): string | null {
  const value = document.cookie.split('; ').find(item => item.startsWith('nf_jwt='))?.slice('nf_jwt='.length);
  if (!value) return null;
  try { return decodeURIComponent(value); } catch { return null; }
}
