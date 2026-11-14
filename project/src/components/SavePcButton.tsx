import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function SavePcButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { user, loading, serviceStatus, profileStatus, googleEnabled, pending, savedPcIds, savePc, removePc } = useAuth();
  const [message, setMessage] = useState('');
  useEffect(() => { setMessage(''); }, [user?.id, productId]);
  const saved = savedPcIds.includes(productId);
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-300/40 px-4 py-3 text-sm font-semibold text-purple-100 hover:bg-purple-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-200 disabled:cursor-wait disabled:opacity-60 ${className}`;
  if (loading || serviceStatus !== 'available' || (!user && !googleEnabled) || (user && profileStatus !== 'ready')) return null;
  if (!user) return <Link className={classes} to="/account?next=%2Fproducts%23inventory"><Bookmark className="h-4 w-4" />Sign in to save</Link>;

  const toggle = async () => {
    setMessage('');
    try {
      if (saved) await removePc(productId); else await savePc(productId);
      setMessage(saved ? 'Removed from your saved PCs.' : 'Saved to your account.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'This change could not be confirmed.'); }
  };
  return <div className="mt-3"><button className={classes} type="button" aria-pressed={saved} disabled={Boolean(pending)} onClick={() => void toggle()}><Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved PC' : 'Save PC'}</button><p className="mt-2 text-sm text-purple-100" role="status">{message}</p></div>;
}
