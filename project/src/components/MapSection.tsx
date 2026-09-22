import ResponsiveImage from './ui/ResponsiveImage';
import { ChevronDown, ExternalLink, MapPin } from 'lucide-react';
import { useId, useState } from 'react';
import ActionLink from './ui/ActionLink';

type MapSectionProps = {
  collapsible?: boolean;
  priorityTop?: boolean;
};

const googleMapsUrl =
  'https://www.google.com/maps/place/Upgrade+Gaming+PCs+%2B+Computer+Repair/@42.957475,-83.8324749,17z/data=!3m1!4b1!4m6!3m5!1s0x88246f304b3af7fb:0xae6166c538ca04ed!8m2!3d42.957475!4d-83.8324749!16s%2Fg%2F11lw8tygg_?entry=ttu';

const embeddedMapUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2919.986974969934!2d-83.83504982347331!3d42.95747889714901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88246f304b3af7fb%3A0xae6166c538ca04ed!2sUpgrade%20Gaming%20PCs%20%2B%20Computer%20Repair!5e0!3m2!1sen!2sus!4v1751560682135!5m2!1sen!2sus';

const MapSection = ({ collapsible = true, priorityTop = false }: MapSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const mapRegionId = useId();

  return (
    <section className={`relative ${priorityTop ? 'pb-10 pt-24 sm:pb-14 sm:pt-32' : 'py-12 sm:py-14'}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/5"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative z-10 overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 p-4 shadow-xl sm:rounded-[1.75rem] sm:p-6 lg:p-8">
          {priorityTop && (
            <>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[78%] overflow-hidden sm:w-[62%] lg:w-[46%]">
                <ResponsiveImage
                  src="/optimized/hero-storefront-dusk.jpg"
                  sizes="(min-width: 1152px) 540px, (min-width: 640px) 60vw, 90vw"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover object-center opacity-35 sm:opacity-[.45]"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-purple-950/15 via-[#160824]/55 to-[#160824]"></div>
              </div>

              <div className="pointer-events-none absolute right-3 top-4 hidden overflow-hidden rounded-[1.15rem] border border-white/15 bg-purple-950/25 shadow-[0_18px_38px_rgba(12,8,39,0.24)] sm:block sm:h-36 sm:w-24 md:right-5 md:top-5 md:h-48 md:w-32 lg:h-56 lg:w-36">
                <ResponsiveImage
                  src="/optimized/hero-storefront-entry.jpg"
                  sizes="144px"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent"></div>
              </div>

              <div className="pointer-events-none absolute -bottom-8 left-[-1rem] h-24 w-24 rounded-full bg-blue-400/10 blur-3xl sm:h-36 sm:w-36"></div>
            </>
          )}

          <div className={priorityTop ? 'relative z-10' : 'flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'}>
            <div className={priorityTop ? 'max-w-2xl sm:pr-24 lg:pr-44' : 'max-w-2xl'}>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-100 sm:text-xs">
                <MapPin className="h-4 w-4" />
                <span>Store Location</span>
              </div>
              <h2 className="mt-4 text-[1.95rem] font-bold leading-tight text-white sm:mt-5 sm:text-3xl lg:text-4xl">
                Visit our Swartz Creek showroom
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-purple-100 sm:mt-4 sm:text-lg">
                Stop by for trade-in evaluations, repair help, and a closer look at the refurbished gaming PCs on display.
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-[1.2rem] border border-purple-300/25 bg-purple-900/25 px-4 py-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-purple-300" />
                <div>
                  <p className="font-semibold text-white">8048 Miller Rd Ste B, Swartz Creek, MI 48473</p>
                  <p className="mt-1 text-sm text-purple-100">Free parking available and easy highway access.</p>
                </div>
              </div>

              <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                <ActionLink href={googleMapsUrl} external className="w-full sm:w-auto">
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-5 w-5" />
                </ActionLink>

                {collapsible && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded((value) => !value)}
                    aria-expanded={isExpanded}
                    aria-controls={mapRegionId}
                    className="action-link inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/25 sm:w-auto sm:px-6 sm:py-3.5"
                  >
                    <span>{isExpanded ? 'Hide Map' : 'Expand Map'}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            id={mapRegionId}
            className={`relative z-10 map-expander ${isExpanded ? 'open mt-6' : 'mt-4'}`}
            hidden={!isExpanded}
          >
            <div className="map-expander-inner overflow-hidden rounded-[1.35rem] border border-purple-300/30 bg-purple-950/30 shadow-[0_24px_50px_rgba(12,8,39,0.28)]">
              <div className="relative h-0 w-full pb-[62%] sm:pb-[58%] lg:pb-[46%]">
                {isExpanded && <iframe
                  src={embeddedMapUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Upgrade Gaming PCs Location"
                />}
                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/45 px-4 py-3">
                  <p className="text-xs leading-relaxed text-purple-100">
                    Use &quot;Open in Google Maps&quot; for directions to the shop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
