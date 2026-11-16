import { useEffect, useState, type FormEvent } from 'react';
import { Bookmark, CheckCircle, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { safeReturnPath } from '../auth/session';
import { SAVE_INTENT_KEY, decodeSaveIntent, encodeSaveIntent, parseSavePcId } from '../auth/saveIntent';
import { formatPcPrice, inventory } from '../config/inventory';
import ActionLink from '../components/ui/ActionLink';

const buttonClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d4fa58] px-5 py-3 font-semibold text-[#101414] hover:bg-[#e2ff89] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4fa58] disabled:cursor-wait disabled:opacity-60';

function readPendingSelection() {
  try { return decodeSaveIntent(window.sessionStorage.getItem(SAVE_INTENT_KEY)); }
  catch { return null; }
}

function clearPendingSelection() {
  try { window.sessionStorage.removeItem(SAVE_INTENT_KEY); }
  catch { /* The selection can still be cleared from this page when browser storage is blocked. */ }
}

function GoogleMark() {
  return <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5.1h6.6c3.8-3.5 6.1-8.6 6.1-14.8Z" /><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.7l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.1 39.5 16 44 24 44Z" /><path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z" /><path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3l5.8-5.8C34.1 5.9 29.5 4 24 4 16 4 9.1 8.5 5.8 15.1l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z" /></svg>;
}

export default function AccountPage() {
  const auth = useAuth();
  const [params, setParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const requestedPcId = parseSavePcId(params.get('save'));
  const [selectedPcId, setSelectedPcId] = useState(() => requestedPcId || readPendingSelection());
  const [selectionMessage, setSelectionMessage] = useState('');
  const selectedPc = inventory.find(product => product.id === selectedPcId);
  const selectedPcSaved = Boolean(selectedPc && auth.savedPcIds.includes(selectedPc.id));
  useEffect(() => {
    if (requestedPcId) { setSelectedPcId(requestedPcId); setSelectionMessage(''); }
  }, [requestedPcId]);
  useEffect(() => {
    if (selectedPcSaved && auth.profileStatus === 'ready') clearPendingSelection();
  }, [selectedPcSaved, auth.profileStatus]);
  const clearSelection = () => {
    clearPendingSelection(); setSelectedPcId(null); setSelectionMessage('');
    const updated = new URLSearchParams(params); updated.delete('save'); setParams(updated, { replace: true });
  };
  const signIn = () => {
    setFormError('');
    if (selectedPc) {
      try { window.sessionStorage.setItem(SAVE_INTENT_KEY, encodeSaveIntent(selectedPc.id)!); }
      catch { setFormError('Your browser could not keep this PC selected through sign-in. Clear the selection below to sign in, then return to the PC to save it.'); return; }
    }
    auth.signInWithGoogle();
  };
  const saveSelection = async () => {
    if (!selectedPc) return;
    setSelectionMessage('');
    try {
      await auth.savePc(selectedPc.id);
      clearPendingSelection();
      setSelectionMessage(`${selectedPc.title} is saved to your account.`);
    } catch (error) { setSelectionMessage(error instanceof Error ? error.message : 'This save could not be confirmed. Please try again.'); }
  };
  const next = safeReturnPath(params.get('next'));
  const canOpenEditor = auth.profileStatus === 'ready' && auth.user?.roles?.includes('admin') === true;
  const finishPassword = async (event: FormEvent) => {
    event.preventDefault(); setFormError('');
    try {
      if (auth.callback?.type === 'invite') await auth.completeInvite(password);
      else await auth.completeRecovery(password);
      setPassword('');
    } catch (error) { setFormError(error instanceof Error ? error.message : 'Please try again.'); }
  };

  return <section className="account-page relative pb-16"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <div className="mb-8 max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-[#718168]/30 bg-[#27312a]/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#bcc7bf]"><UserRound className="h-4 w-4" />Your account</span><h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">Keep your next PC in mind.</h1><p className="mt-4 text-base leading-relaxed text-[#bcc7bf] sm:text-lg">Save systems you like and come back to compare them. You can browse PCs, ask questions, and visit the showroom without an account.</p></div>
    <div className="rounded-3xl border border-[#718168]/30 bg-[#131918]/60 p-5 shadow-xl sm:p-8">
      {selectedPc && !auth.callback && <section aria-labelledby="selected-pc-title" className="mb-8 rounded-2xl border border-[#d4fa58]/35 bg-[#27312a]/40 p-4 sm:p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#d4fa58]">Your selected PC</p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {selectedPc.image && <img src={selectedPc.image} alt={selectedPc.imageAlt || selectedPc.title} width="80" height="100" className="h-28 w-24 shrink-0 rounded-lg bg-[#101414] object-contain" />}
          <div className="min-w-0 flex-1"><h2 id="selected-pc-title" className="text-xl font-semibold text-white">{selectedPc.title}</h2><p className="mt-1 text-sm text-[#bcc7bf]">{formatPcPrice(selectedPc.price)} · {selectedPc.status === 'reserved' ? 'Reserved' : 'Available'}</p><p className="mt-2 text-sm text-[#bcc7bf]">{auth.user ? selectedPcSaved ? 'This PC is in your saved list.' : 'Confirm below to add this PC to your shortlist.' : 'Sign in below, then confirm this PC to add it to your shortlist.'}</p></div>
          {auth.user && auth.profileStatus === 'ready' && <button type="button" className={buttonClass} disabled={Boolean(auth.pending) || selectedPcSaved} onClick={() => void saveSelection()}><Bookmark className="h-4 w-4" aria-hidden="true" />{selectedPcSaved ? 'Saved' : auth.pending === 'save' ? 'Saving…' : 'Save this PC'}</button>}
        </div>
        {selectionMessage && <p className="mt-4 text-sm text-[#e5f4de]" role="status">{selectionMessage}</p>}
        <button type="button" className="mt-3 min-h-11 text-sm text-[#bcc7bf] underline underline-offset-4 hover:text-white" onClick={clearSelection}>Clear selection</button>
      </section>}
      {selectedPcId && !selectedPc && !auth.callback && <div className="mb-8 rounded-2xl border border-[#718168]/30 p-5"><p className="text-[#bcc7bf]">The PC you selected is no longer in the current inventory. Browse available PCs or ask the shop about similar options.</p><button type="button" className="mt-3 min-h-11 text-sm text-[#bcc7bf] underline underline-offset-4 hover:text-white" onClick={clearSelection}>Clear selection</button></div>}
      {auth.loading ? <p role="status" className="text-[#bcc7bf]">Checking sign-in…</p> : auth.callback ? <form className="max-w-md" onSubmit={event => void finishPassword(event)}><h2 className="text-2xl font-semibold text-white">{auth.callback.type === 'invite' ? 'Finish your invitation' : 'Choose a new password'}</h2><label className="mt-5 block text-sm font-semibold text-[#bcc7bf]" htmlFor="account-password">New password</label><input id="account-password" type="password" autoComplete="new-password" minLength={10} required value={password} onChange={event => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#718168]/50 bg-[#131918] px-4 py-3 text-white focus:outline focus:outline-2 focus:outline-[#d4fa58]" /><p className="mt-2 text-sm text-[#aeb9b3]">Use at least 10 characters.</p><button className={`${buttonClass} mt-5`} disabled={Boolean(auth.pending)} type="submit">{auth.pending ? 'Saving…' : 'Save password'}</button></form> : auth.user ? <>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="flex items-center gap-2 text-sm font-semibold text-[#aeb9b3]"><CheckCircle className="h-4 w-4" />Signed in</p><h2 className="mt-2 break-words text-2xl font-semibold text-white">{auth.user.name || 'Welcome back'}</h2>{auth.user.email && <p className="mt-1 break-all text-[#bcc7bf]">{auth.user.email}</p>}</div><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#718168]/40 px-4 py-3 font-semibold text-[#bcc7bf] hover:bg-[#344133]/50 disabled:opacity-60" type="button" disabled={Boolean(auth.pending)} onClick={() => { void auth.signOut().catch(() => undefined); }}><LogOut className="h-4 w-4" />{auth.pending === 'logout' ? 'Signing out…' : 'Sign out'}</button></div>
        {canOpenEditor && <section aria-labelledby="website-administration-title" className="mt-8 rounded-2xl border border-[#718168]/30 bg-[#27312a]/25 p-5">
          <h2 id="website-administration-title" className="flex items-center gap-2 text-xl font-semibold text-white"><ShieldCheck className="h-5 w-5" />Website administration</h2>
          <p className="mt-3 text-[#bcc7bf]">Update PC listings, photos, page text, contact details, and repair services.</p>
          <a href="/admin/" className={`${buttonClass} mt-5`}>Open website editor</a>
          <p className="mt-3 text-sm leading-relaxed text-[#aeb9b3]">The editor uses your GitHub editing key. Changes save to the review website first.</p>
        </section>}
        <div className="mt-8 border-t border-[#718168]/20 pt-7"><h2 className="flex items-center gap-2 text-xl font-semibold text-white"><Bookmark className="h-5 w-5" />Saved PCs <span className="text-base font-normal text-[#aeb9b3]">({auth.savedPcIds.length})</span></h2>{auth.profileStatus !== 'ready' ? <div className="mt-4"><p className="text-[#bcc7bf]" role="status">{auth.profileStatus === 'checking' ? 'Loading your saved PCs…' : 'Your saved PCs could not be loaded.'}</p>{auth.profileStatus === 'unavailable' && <button type="button" className={`${buttonClass} mt-4`} disabled={Boolean(auth.pending)} onClick={() => void auth.retry()}>Try loading again</button>}</div> : auth.savedPcIds.length ? <ul className="mt-5 grid gap-4">{auth.savedPcIds.map(id => { const product = inventory.find(item => item.id === id); return <li key={id} className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-[#718168]/20 bg-[#131918]/25 p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-center gap-4">{product?.image && <img src={product.image} alt={product.imageAlt || product.title} width="64" height="86" loading="lazy" className="h-[86px] w-16 shrink-0 rounded-lg bg-[#131918]/40 object-contain" />}<div className="min-w-0"><h3 className="break-words font-semibold text-white">{product?.title || 'A previously saved PC'}</h3>{product ? <p className="mt-1 text-sm text-[#bcc7bf]">{formatPcPrice(product.price)} · {product.status === 'reserved' ? 'Reserved' : 'Available'}</p> : <p className="mt-1 text-sm text-[#aeb9b3]">This system is no longer listed. Ask the shop about similar options.</p>}</div></div><div className="flex flex-wrap gap-3">{product && <ActionLink to={`/products#pc-${id}`} variant="secondary" size="sm">View PC</ActionLink>}<button className="min-h-11 rounded-xl border border-[#718168]/30 px-4 py-2 text-sm font-semibold text-[#bcc7bf] hover:bg-[#344133]/50 disabled:opacity-60" disabled={Boolean(auth.pending)} type="button" aria-label={`Remove ${product?.title || 'previously saved PC'} from saved PCs`} onClick={() => { void auth.removePc(id).catch(() => undefined); }}>Remove</button></div></li>; })}</ul> : <p className="mt-4 text-[#bcc7bf]">Your shortlist is empty. Use “Save PC” on any listed system to keep it here.</p>}<div className="mt-5"><ActionLink to={next === '/products#inventory' ? next : '/products#inventory'}>Browse PCs</ActionLink></div><p className="mt-4 text-sm text-[#aeb9b3]">Saving a PC does not reserve it or lock in its price. Contact the shop to confirm availability.</p></div>
      </> : <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]"><div><h2 className="text-2xl font-semibold text-white">Your saved PCs, in one place.</h2><p className="mt-3 text-[#bcc7bf]">Use your Google account to keep a shortlist across visits. We never receive your Google password.</p>{auth.googleEnabled ? <button type="button" onClick={signIn} className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4fa58]"><GoogleMark />Continue with Google</button> : <div className="mt-5 rounded-2xl border border-[#718168]/30 bg-[#27312a]/30 p-4"><p className="font-semibold text-white">Google sign-in is not available yet.</p><p className="mt-2 text-sm leading-relaxed text-[#bcc7bf]">{auth.serviceStatus === 'unavailable' ? 'Account sign-in is still being connected for this website. You can still browse and contact us.' : 'The shop is finishing Google sign-in setup. You can still browse and contact us.'}</p>{auth.enabled && <button type="button" className={`${buttonClass} mt-4`} onClick={() => void auth.retry()}>Try sign-in again</button>}</div>}<div className="mt-5"><ActionLink to="/products#inventory" variant="secondary">Keep browsing PCs</ActionLink></div></div><div className="rounded-2xl border border-[#718168]/20 bg-[#27312a]/20 p-5"><ShieldCheck className="h-7 w-7 text-[#aeb9b3]" /><h3 className="mt-4 font-semibold text-white">Your shortlist stays with you</h3><p className="mt-2 text-sm leading-relaxed text-[#bcc7bf]">Sign-in is optional. Save PCs for later and compare them across visits. Check with the shop before coming in, because prices and availability can change.</p></div></div>}
      {(auth.error || formError) && <p role="alert" className="mt-6 rounded-xl border border-amber-300/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">{formError || auth.error}</p>}
    </div>
  </div></section>;
}
