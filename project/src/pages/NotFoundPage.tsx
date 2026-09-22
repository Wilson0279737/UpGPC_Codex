import ActionLink from '../components/ui/ActionLink';

const NotFoundPage = () => (
  <section className="mx-auto max-w-3xl px-6 pb-20 pt-36">
    <p className="font-semibold text-purple-200">404</p>
    <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
    <p className="mt-5 text-lg text-purple-100">This address doesn’t match a page on our site. Find gaming PCs, repair help, or contact the shop below.</p>
    <div className="mt-8 flex flex-wrap gap-3">
      <ActionLink to="/">Back to home</ActionLink>
      <ActionLink to="/services" variant="secondary">Repair services</ActionLink>
      <ActionLink to="/contact" variant="secondary">Contact the shop</ActionLink>
    </div>
  </section>
);

export default NotFoundPage;
