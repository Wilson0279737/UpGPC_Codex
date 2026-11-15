import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function SavePcButton({ productId, productTitle = 'this PC', compact = false, className = '' }: { productId: string; productTitle?: string; compact?: boolean; className?: string }) {
  const { user, loading, serviceStatus, profileStatus, googleEnabled, pending, savedPcIds, savePc, removePc } = useAuth();
  const [message, setMessage] = useState('');
  useEffect(() => { setMessage(''); }, [user?.id, productId]);
  const saved = savedPcIds.includes(productId);
  const classes = compact ? `pc-save-button ${className}` : `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-300/40 px-4 py-3 text-sm font-semibold text-purple-100 hover:bg-purple-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-200 disabled:cursor-wait disabled:opacity-60 ${className}`;
  if (loading || serviceStatus !== 'available' || (!user && !googleEnabled) || (user && profileStatus !== 'ready')) return null;
  if (!user) return <Link className={classes} title={`Sign in to save ${productTitle}`} aria-label={compact ? `Sign in to save ${productTitle}` : undefined} to="/account?next=%2Fproducts%23inventory"><Bookmark className="h-4 w-4" aria-hidden="true" />{!compact && 'Sign in to save'}</Link>;

  const toggle = async () => {
    setMessage('');
    try {
      if (saved) await removePc(productId); else await savePc(productId);
      setMessage(saved ? 'Removed from your saved PCs.' : 'Saved to your account.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'This change could not be confirmed.'); }
  };
  return <div className={compact ? 'pc-save-control' : 'mt-3'}><button className={classes} type="button" title={saved ? `Remove ${productTitle} from saved PCs` : `Save ${productTitle}`} aria-label={compact ? saved ? `Remove ${productTitle} from saved PCs` : `Save ${productTitle}` : undefined} aria-pressed={saved} disabled={Boolean(pending)} onClick={() => void toggle()}><Bookmark className="h-4 w-4" aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />{!compact && (saved ? 'Saved PC' : 'Save PC')}</button><p className={compact ? 'pc-save-message' : 'mt-2 text-sm text-purple-100'} role="status">{message}</p></div>;
}
