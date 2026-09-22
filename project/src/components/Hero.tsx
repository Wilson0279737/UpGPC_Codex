import ResponsiveImage from './ui/ResponsiveImage';
import { MapPin, ShoppingBag, Wrench } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import { siteConfig } from '../config/site';

type HeroProps = {
  compactTop?: boolean;
  showAddressCard?: boolean;
};

const Hero = ({ compactTop = false, showAddressCard = true }: HeroProps) => {
  return (
    <section
      id="home"
      className={`relative overflow-hidden pb-14 sm:pb-20 ${compactTop ? 'pt-5 sm:pt-8' : 'pt-24 sm:pt-28'}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="hero-banner relative mx-auto w-full max-w-5xl overflow-hidden rounded-[1.4rem] shadow-2xl sm:rounded-[1.75rem]">
          <ResponsiveImage
            src="/optimized/home-hero.jpg"
            sizes="(min-width: 1152px) 1024px, calc(100vw - 32px)"
            alt="Custom gaming PC with RGB lighting and a graphics card at Upgrade Gaming PCs"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60"></div>

          <div className="relative flex min-h-96 items-center py-8 sm:py-12">
            <div className="w-full max-w-3xl px-5 sm:px-10 lg:px-16">
              <h1 className="text-[2rem] font-bold leading-tight text-white sm:text-4xl lg:text-5xl">Gaming PCs &amp; computer repair in Swartz Creek</h1>
              <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-gray-200 sm:mt-4 sm:text-xl">
                Play before you pay. Test gaming PCs in-store, explore custom builds, or get help with repairs and upgrades from your local shop.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ActionLink to="/products" className="w-full sm:w-auto">
                  <ShoppingBag className="h-5 w-5" />
                  <span>View Products</span>
                </ActionLink>
                <ActionLink to="/services" variant="secondary" className="w-full sm:w-auto">
                  <Wrench className="h-5 w-5" />
                  <span>Repair Services</span>
                </ActionLink>
              </div>
            </div>
          </div>
        </div>

        {showAddressCard && (
          <div className="hero-address mx-auto mt-6 max-w-2xl rounded-[1.35rem] border border-purple-300/30 bg-purple-800/30 p-5 sm:mt-8 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-purple-300" />
              <div>
                <a href={siteConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-base font-semibold text-white underline decoration-purple-300/60 underline-offset-4 hover:decoration-white sm:text-lg">8048 Miller Rd Ste B, Swartz Creek, MI 48473</a>
                <p className="mt-1 text-sm text-purple-100">Visit our showroom and test before you buy.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
