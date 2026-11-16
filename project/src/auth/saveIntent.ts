import { SAFE_PC_ID } from './shortlist.ts';

// This is only a pending selection for the current browser tab, never a saved-PC list.
export const SAVE_INTENT_KEY = 'upgpc.pending-save.v1';
const SAVE_INTENT_LIFETIME = 30 * 60 * 1000;

export function parseSavePcId(value: unknown): string | null {
  return typeof value === 'string' && SAFE_PC_ID.test(value) ? value : null;
}

export function savePcAccountPath(productId: string): string {
  const id = parseSavePcId(productId);
  return id ? `/account?save=${encodeURIComponent(id)}&next=%2Fproducts%23inventory` : '/account';
}

export function encodeSaveIntent(productId: string, now = Date.now()): string | null {
  const id = parseSavePcId(productId);
  return id ? JSON.stringify({ productId: id, createdAt: now }) : null;
}

export function decodeSaveIntent(value: string | null, now = Date.now()): string | null {
  if (!value) return null;
  try {
    const intent: unknown = JSON.parse(value);
    if (!intent || typeof intent !== 'object' || Array.isArray(intent)) return null;
    const { productId, createdAt } = intent as Record<string, unknown>;
    if (typeof createdAt !== 'number' || !Number.isFinite(createdAt) || createdAt > now || now - createdAt > SAVE_INTENT_LIFETIME) return null;
    return parseSavePcId(productId);
  } catch { return null; }
}
