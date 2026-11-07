import { siteConfig } from '../config/site';
import { Monitor } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import { cardClass, iconBadgeClass, insetPanelClass } from './ui/siteStyles';

const points = ['Ready-to-play desktops', 'Custom build recommendations', 'Performance and budget matching'];

const HomeGamingFeature = () => {
  return (
    <section className="relative py-10 sm:py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <article className={`${cardClass} flex h-full flex-col`}>
            <div className={iconBadgeClass}>
              <Monitor className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl">Refurbished and Custom Gaming PCs</h2>
            <p className="mt-3 text-sm leading-relaxed text-purple-100 sm:text-base">
              Shop tested systems, compare options in-store, and get guidance based on the games you actually play.
            </p>
            <ul className="mt-4 flex-1 space-y-3 sm:mt-5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-purple-100">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-300"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 sm:mt-6">
              <ActionLink to="/products" variant="secondary" className="w-full sm:w-auto">
                Browse Gaming PCs
              </ActionLink>
            </div>
          </article>

          <div className={`${insetPanelClass} flex h-full flex-col justify-between`}>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-purple-100">Need help deciding?</p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Not sure whether you need repair, replacement, or an upgrade?
              </h2>
              <p className="mt-3 max-w-2xl text-purple-100">
                Start with a conversation and we can point you toward the smartest option for your budget and timing.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
              <ActionLink to="/contact" className="w-full sm:w-auto">
                Start the conversation
              </ActionLink>
              <ActionLink href={siteConfig.phoneHref} variant="secondary" className="w-full sm:w-auto">
                Call the shop
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeGamingFeature;
