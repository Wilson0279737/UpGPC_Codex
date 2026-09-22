import ResponsiveImage from './ui/ResponsiveImage';
import { ArrowUpCircle, RefreshCcw, Wrench } from 'lucide-react';
import ActionLink from './ui/ActionLink';

const highlights = [
  {
    title: 'Diagnostics and repair help',
    icon: Wrench,
  },
  {
    title: 'Upgrade planning',
    icon: ArrowUpCircle,
  },
  {
    title: 'Trade-ins and next-step advice',
    icon: RefreshCcw,
  },
];

const ServicesPageHero = () => {
  return (
    <section className="relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 p-4 shadow-xl sm:rounded-[1.75rem] sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[82%] overflow-hidden sm:w-[66%] lg:w-[48%]">
            <ResponsiveImage
              src="/optimized/storefront-interior.jpg"
              sizes="(min-width: 1152px) 540px, (min-width: 640px) 60vw, 90vw"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-[.28] sm:opacity-[.38] lg:opacity-[.48]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-purple-950/10 via-[#160824]/60 to-[#160824]"></div>
          </div>

          <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-blue-400/10 blur-3xl sm:h-36 sm:w-36"></div>

          <div className="relative z-10 max-w-2xl lg:pr-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-100 sm:text-xs">
              <Wrench className="h-4 w-4" />
              <span>Services</span>
            </div>

            <h1 className="mt-4 text-[2rem] font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-[2.85rem]">
              Repair, upgrade, and trade-in help from a real local shop
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-purple-100 sm:mt-4 sm:text-lg">
              Bring in a problem machine, ask about replacement parts, plan a smarter upgrade, or talk through a trade-in
              with someone face to face in the showroom.
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
              <ActionLink to="/contact" className="w-full sm:w-auto">
                Ask About Repairs
              </ActionLink>
              <ActionLink href="tel:+18104413020" variant="secondary" className="w-full sm:w-auto">
                Call the shop
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPageHero;
