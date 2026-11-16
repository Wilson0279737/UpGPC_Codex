import ActionLink from '../components/ui/ActionLink';

export default function NotFoundPage() {
  return <section className="studio-page"><div className="studio-wrap"><div className="mx-auto max-w-4xl rounded-3xl border border-purple-300/30 bg-purple-900/20 p-6 shadow-xl sm:p-10"><p className="text-sm font-semibold uppercase tracking-widest text-purple-300">404</p><h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Page not found</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-purple-100">This link may have changed. Browse our gaming PCs or get in touch with the shop.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><ActionLink to="/">Back to home</ActionLink><ActionLink to="/products" variant="secondary">Browse gaming PCs</ActionLink></div></div></div></section>;
}
