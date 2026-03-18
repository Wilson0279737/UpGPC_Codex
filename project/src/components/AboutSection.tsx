import { MapPin, Monitor, Shield, Wrench } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import { cardClass, iconBadgeClass } from './ui/siteStyles';

const highlights = [
  {
    title: 'Local showroom',
    description: 'See systems in person and talk with someone face to face before spending your money.',
    icon: MapPin,
  },
  {
    title: 'Try before you buy',
    description: 'Hands-on testing is part of the experience, not an upsell after the fact.',
    icon: Monitor,
  },
  {
    title: 'Repair confidence',
    description: 'Bring in a machine with issues and get honest guidance about the best next step.',
    icon: Wrench,
  },
  {
    title: '90 day free warranty',
    description: 'Repairs and systems include a 90 day free warranty with real local follow-up support.',
    icon: Shield,
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative scroll-mt-28 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="About"
              title="Built around trust, plain answers, and a real storefront"
              description="Upgrade Gaming PCs is designed for people who want to see what they are buying, ask real questions, and work with someone local instead of guessing through listings online."
            >
              <ActionLink to="/products" className="w-full sm:w-auto">
                See what's available
              </ActionLink>
              <ActionLink to="/contact" variant="secondary" className="w-full sm:w-auto">
                Ask a question
              </ActionLink>
            </SectionHeader>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-purple-100 sm:mt-6 sm:text-base">
              Whether you are shopping for your first gaming setup, replacing a broken system, or planning a smarter
              upgrade path, the goal stays the same: clear answers, hands-on testing, and local support after the sale.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className={cardClass}>
                  <div className={iconBadgeClass}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-purple-100">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
