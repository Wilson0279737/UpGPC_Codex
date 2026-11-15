import { siteConfig } from '../config/site';
import { ExternalLink, Gamepad2, Monitor, MousePointer2 } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import PanelFrame from './ui/PanelFrame';
import SectionHeader from './ui/SectionHeader';
import { cardClass, iconBadgeClass } from './ui/siteStyles';

const marketplaceUrl = siteConfig.marketplaceUrl;

const categories = [
  {
    title: 'Gaming PCs',
    description: 'Compare listed systems and contact the shop about the games you play and your budget.',
    icon: Gamepad2,
  },
  {
    title: 'Monitors',
    description: 'Browse display options alongside the systems they pair well with.',
    icon: Monitor,
  },
  {
    title: 'Peripherals',
    description: 'Check what is currently listed for keyboards, mice, and other desk setup essentials.',
    icon: MousePointer2,
  },
];

const MarketplaceInventory = () => {
  return (
    <section className="relative py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <PanelFrame label="Marketplace listings" innerClassName="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader
              eyebrow="Facebook Marketplace Inventory"
              title="Browse more PCs and setup essentials on Marketplace"
              description="See the shop's current Marketplace listings, then get in touch to confirm availability, ask a question, or arrange an in-store look."
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href={marketplaceUrl} external className="w-full sm:w-auto">
                <span>Open Marketplace Profile</span>
                <ExternalLink className="h-5 w-5" />
              </ActionLink>
              <ActionLink to="/contact" variant="secondary" className="w-full sm:w-auto">
                Ask about a listing
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <article key={category.title} className={cardClass}>
                  <div className={iconBadgeClass}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white sm:text-xl">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-purple-100 sm:text-base">{category.description}</p>
                </article>
              );
            })}
          </div>
        </PanelFrame>
      </div>
    </section>
  );
};

export default MarketplaceInventory;
