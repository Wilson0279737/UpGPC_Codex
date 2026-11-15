import type { CallbackResult } from '@netlify/identity';

export const AUTH_HASH_KEYS = ['access_token', 'refresh_token', 'confirmation_token', 'invite_token', 'recovery_token', 'email_change_token', 'error', 'error_description'];

export function consumeAuthCallback(
  handle: () => Promise<CallbackResult | null>,
  location: { hash: string; pathname: string; search: string },
  replaceUrl: (url: string) => void,
): Promise<CallbackResult | null> {
  const params = new URLSearchParams(location.hash.slice(1));
  const sensitive = AUTH_HASH_KEYS.some(key => params.has(key));
  if (params.has('error')) {
    if (sensitive) replaceUrl(location.pathname + location.search);
    return Promise.reject(new Error('Provider callback failed'));
  }
  try {
    // SDK 2.x reads the hash synchronously before its first asynchronous request.
    return handle();
  } finally {
    if (sensitive) replaceUrl(location.pathname + location.search);
  }
}
