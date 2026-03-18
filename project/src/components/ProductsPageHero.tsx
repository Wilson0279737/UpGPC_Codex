import { Cpu, Monitor, Shield } from 'lucide-react';
import ActionLink from './ui/ActionLink';

const highlights = [
  {
    title: 'Ready-to-play systems',
    icon: Monitor,
  },
  {
    title: 'Custom build guidance',
    icon: Cpu,
  },
  {
    title: '90 day free warranty',
    icon: Shield,
  },
];

const marketplaceUrl = 'https://www.facebook.com/marketplace/profile/100086538835294/';

const ProductsPageHero = () => {
  return (
    <section className="relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 p-4 shadow-xl sm:rounded-[1.75rem] sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[82%] overflow-hidden sm:w-[66%] lg:w-[48%]">
            <img
              src="/optimized/hero-products-collage.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-22 sm:opacity-30 lg:opacity-42"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-purple-950/10 via-[#160824]/60 to-[#160824]"></div>
          </div>

          <div className="pointer-events-none absolute right-4 top-4 hidden rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_16px_30px_rgba(7,20,40,0.22)] md:block">
            All available PCs and peripherals are posted on Marketplace
          </div>

          <div className="pointer-events-none absolute right-3 top-20 hidden overflow-hidden rounded-[1.15rem] border border-white/15 bg-purple-950/25 shadow-[0_18px_38px_rgba(12,8,39,0.24)] sm:block sm:h-36 sm:w-24 md:right-5 md:top-20 md:h-48 md:w-32 lg:h-56 lg:w-36">
            <img
              src="/optimized/hero-products-glamor.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/8 to-transparent"></div>
          </div>

          <div className="pointer-events-none absolute bottom-4 right-[24%] hidden overflow-hidden rounded-[1.15rem] border border-white/15 bg-purple-950/25 shadow-[0_18px_38px_rgba(12,8,39,0.22)] lg:block lg:h-36 lg:w-28">
            <img
              src="/optimized/hero-products-rgb.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/8 to-transparent"></div>
          </div>

          <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl sm:h-36 sm:w-36"></div>

          <div className="relative z-10 max-w-2xl sm:pr-24 lg:pr-48">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-100 sm:text-xs">
              <Monitor className="h-4 w-4" />
              <span>Products</span>
            </div>

            <h1 className="mt-4 text-[2rem] font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-[2.85rem]">
              Gaming PCs you can compare in person before you buy
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-purple-100 sm:mt-4 sm:text-lg">
              We keep all of our available PCs and peripherals posted on our Marketplace profile, so you can browse what is
              in stock, compare options, and head to the shop with a better idea of what fits your setup and budget.
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
              <ActionLink href={marketplaceUrl} external className="w-full sm:w-auto">
                See All Available PCs and Peripherals
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPageHero;
