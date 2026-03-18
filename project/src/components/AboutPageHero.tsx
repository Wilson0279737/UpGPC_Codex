import { HeartHandshake, Monitor, Store } from 'lucide-react';
import ActionLink from './ui/ActionLink';

const highlights = [
  {
    title: 'Real local storefront',
    icon: Store,
  },
  {
    title: 'Hands-on testing',
    icon: Monitor,
  },
  {
    title: 'Support after the sale',
    icon: HeartHandshake,
  },
];

const AboutPageHero = () => {
  return (
    <section className="relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 p-4 shadow-xl sm:rounded-[1.75rem] sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[84%] overflow-hidden sm:w-[68%] lg:w-[48%]">
            <img
              src="/optimized/about-hero-main.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-24 sm:opacity-34 lg:opacity-46"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-purple-950/30 via-[#160824]/78 to-[#160824]"></div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,9,28,0.95)_0%,rgba(14,9,28,0.84)_44%,rgba(14,9,28,0.5)_100%)]"></div>

          <div className="pointer-events-none absolute right-3 top-4 hidden overflow-hidden rounded-[1.15rem] border border-white/15 bg-purple-950/25 shadow-[0_18px_38px_rgba(12,8,39,0.24)] sm:block sm:h-36 sm:w-24 md:right-5 md:top-5 md:h-48 md:w-32 lg:h-56 lg:w-36">
            <img
              src="/optimized/about-collage-04.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/8 to-transparent"></div>
          </div>

          <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-blue-400/10 blur-3xl sm:h-36 sm:w-36"></div>

          <div className="relative z-10 max-w-2xl sm:pr-24 lg:pr-48">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-100 sm:text-xs">
              <Store className="h-4 w-4" />
              <span>About Us</span>
            </div>

            <h1 className="mt-4 text-[2rem] font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-[2.85rem]">
              A local gaming PC shop built by real people who care about the experience
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-purple-100 sm:mt-4 sm:text-lg">
              Upgrade Gaming PCs was built around straight answers, hands-on testing, and a storefront where customers can
              actually see the people behind the business instead of guessing who they are buying from.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.15rem] border border-purple-300/25 bg-purple-900/25 px-4 py-3 text-sm text-purple-100"
                  >
                    <Icon className="h-4 w-4 text-purple-300" />
                    <p className="mt-2 leading-relaxed">{item.title}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ActionLink to="/products" className="w-full sm:w-auto">
                See what&apos;s available
              </ActionLink>
              <ActionLink to="/contact" variant="secondary" className="w-full sm:w-auto">
                Contact the shop
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPageHero;
