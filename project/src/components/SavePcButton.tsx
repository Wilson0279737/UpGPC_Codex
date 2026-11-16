import { useEffect, useState } from 'react';
import { Bookmark, Loader2 as LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { savePcAccountPath } from '../auth/saveIntent';

export default function SavePcButton({ productId, productTitle = 'this PC', compact = false, className = '' }: { productId: string; productTitle?: string; compact?: boolean; className?: string }) {
  const { user, loading, serviceStatus, profileStatus, googleEnabled, pending, savedPcIds, savePc, removePc } = useAuth();
  const [message, setMessage] = useState('');
  const [working, setWorking] = useState(false);
  useEffect(() => { setMessage(''); }, [user?.id, productId]);
  const saved = savedPcIds.includes(productId);
  const classes = compact ? `pc-save-button ${className}` : `brand-save-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--studio-line)] px-4 py-3 text-sm font-semibold text-[var(--studio-muted)] hover:bg-[var(--studio-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--studio-accent)] disabled:cursor-wait disabled:opacity-60 ${className}`;
  if (loading || serviceStatus !== 'available' || (!user && !googleEnabled) || (user && profileStatus !== 'ready')) return null;
  if (!user) return <Link className={classes} title={`Sign in to save ${productTitle}`} aria-label={compact ? `Sign in to save ${productTitle}` : undefined} to={savePcAccountPath(productId)}><Bookmark className="h-4 w-4" aria-hidden="true" />{!compact && 'Sign in to save'}</Link>;

  const toggle = async () => {
    setMessage('');
    setWorking(true);
    try {
      if (saved) await removePc(productId); else await savePc(productId);
      setMessage(saved ? 'Removed from your saved PCs.' : 'Saved to your account.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'This change could not be confirmed.'); }
    finally { setWorking(false); }
  };
  return <div className={compact ? 'pc-save-control' : 'mt-3'}><button className={classes} type="button" title={saved ? `Remove ${productTitle} from saved PCs` : `Save ${productTitle}`} aria-label={compact ? saved ? `Remove ${productTitle} from saved PCs` : `Save ${productTitle}` : undefined} aria-pressed={saved} aria-busy={working} disabled={Boolean(pending) || working} onClick={() => void toggle()}>{working ? <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />}<span>{working ? 'Saving…' : saved ? 'Saved' : 'Save'}</span></button><p className={compact ? 'pc-save-message' : 'mt-2 text-sm text-[var(--studio-muted)]'} role="status">{message}</p></div>;
}
