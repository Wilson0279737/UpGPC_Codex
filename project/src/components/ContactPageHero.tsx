import { siteConfig, siteContent } from '../config/site';
import { Mail, Phone } from 'lucide-react';
import ActionLink from './ui/ActionLink';

const googleMapsUrl = siteConfig.googleMapsUrl;

const ContactPageHero = () => {
  return (
    <section className="relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 p-4 shadow-xl sm:rounded-[1.75rem] sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[82%] overflow-hidden sm:w-[66%] lg:w-[48%]">
            <img
              src="/optimized/hero-storefront-dusk.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-24 sm:opacity-34 lg:opacity-46"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-purple-950/24 via-[#160824]/76 to-[#160824]"></div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,9,28,0.95)_0%,rgba(14,9,28,0.83)_44%,rgba(14,9,28,0.48)_100%)]"></div>

          <div className="pointer-events-none absolute right-3 top-4 hidden overflow-hidden rounded-[1.15rem] border border-white/15 bg-purple-950/25 shadow-[0_18px_38px_rgba(12,8,39,0.24)] sm:block sm:h-36 sm:w-24 md:right-5 md:top-5 md:h-48 md:w-32 lg:h-56 lg:w-36">
            <img
              src="/optimized/hero-storefront-entry.jpg"
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
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </div>

            <h1 className="mt-4 text-[2rem] font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-[2.85rem]">
              {siteContent.contact.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-purple-100 sm:mt-4 sm:text-lg">
              {siteContent.contact.description}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ActionLink href={siteConfig.phoneHref} className="w-full sm:w-auto">
                Call The Shop
              </ActionLink>
              <ActionLink
                href={siteConfig.emailHref}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Mail className="h-5 w-5" />
                <span>Email The Shop</span>
              </ActionLink>
              <ActionLink href={googleMapsUrl} external variant="secondary" className="w-full sm:w-auto">
                Open In Google Maps
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPageHero;
