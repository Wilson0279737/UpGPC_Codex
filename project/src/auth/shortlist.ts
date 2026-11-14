import type { User } from '@netlify/identity';

export const MAX_SAVED_PCS = 100;
export const SAFE_PC_ID = /^[a-z0-9][a-z0-9-]{0,199}$/;
const MAX_SHORTLIST_CHARACTERS = 1500;

export function savedPcIds(user: User | null): string[] {
  const saved = user?.userMetadata?.saved_pcs;
  if (!Array.isArray(saved)) return [];
  return [...new Set(saved.filter((id): id is string => typeof id === 'string' && SAFE_PC_ID.test(id)))].slice(0, MAX_SAVED_PCS);
}

export function nextSavedPcIds(user: User, id: string, save: boolean): string[] {
  if (!SAFE_PC_ID.test(id)) throw new Error('This PC could not be saved.');
  const ids = savedPcIds(user);
  const next = save ? [...new Set([...ids, id])] : ids.filter(saved => saved !== id);
  if (save && (next.length > MAX_SAVED_PCS || JSON.stringify(next).length > MAX_SHORTLIST_CHARACTERS)) {
    throw new Error('Your shortlist is full. Remove a PC before saving another.');
  }
  return next;
}

export function safeReturnPath(value: string | null): string {
  return value === '/products#inventory' ? value : '/account';
}
