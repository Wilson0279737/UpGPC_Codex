import { Monitor, Wrench } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import { cardClass, iconBadgeClass, insetPanelClass } from './ui/siteStyles';

const services = [
  {
    title: 'Computer Repair and Trade-In',
    description:
      'Get help with diagnostics, broken hardware, performance issues, and upgrade planning without the usual runaround.',
    points: [
      'Troubleshooting and repair guidance',
      'Trade-in conversations for your next setup',
      'Straight answers on whether to fix or replace',
    ],
    icon: Wrench,
    cta: { label: 'Ask About Repairs', to: '/contact' },
  },
  {
    title: 'Refurbished and Custom Gaming PCs',
    description:
      'Shop tested systems, compare options in-store, and get guidance based on the games you actually play.',
    points: ['Ready-to-play desktops', 'Custom build recommendations', 'Performance and budget matching'],
    icon: Monitor,
    cta: { label: 'Browse Gaming PCs', to: '/products' },
  },
];

type ServicesSnapshotProps = {
  showHeader?: boolean;
};

const ServicesSnapshot = ({ showHeader = true }: ServicesSnapshotProps) => {
  const CardHeading = showHeader ? 'h3' : 'h2';

  return (
    <section id="services" className="relative py-14 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          {showHeader ? (
            <SectionHeader
              eyebrow="Services"
              title="Repairs, upgrades, and honest help for every stage of your setup"
              description="Bring in a problem machine, plan your next upgrade, or talk through a trade-in with someone local."
              align="center"
              className="mx-auto max-w-3xl"
            />
          ) : null}

          <div className={`${showHeader ? 'mt-8 md:mt-10' : ''} grid gap-5 md:grid-cols-2 md:gap-8`}>
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article key={service.title} className={`${cardClass} flex h-full flex-col`}>
                  <div className={iconBadgeClass}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardHeading className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl">{service.title}</CardHeading>
                  <p className="mt-3 text-sm leading-relaxed text-purple-100 sm:text-base">{service.description}</p>
                  <ul className="mt-4 flex-1 space-y-3 sm:mt-5">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-purple-100">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-300"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 sm:mt-6">
                    <ActionLink to={service.cta.to} variant="secondary" className="w-full sm:w-auto">
                      <span>{service.cta.label}</span>
                    </ActionLink>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={`mt-6 flex flex-col gap-4 sm:mt-8 lg:flex-row lg:items-center lg:justify-between ${insetPanelClass}`}>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-purple-100">Need help deciding?</p>
              <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Not sure whether you need repair, replacement, or an upgrade?
              </p>
              <p className="mt-2 max-w-2xl text-purple-100">
                Start with a conversation and we can point you toward the smartest option for your budget and timing.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ActionLink to="/contact" className="w-full sm:w-auto">
                Start the conversation
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

export default ServicesSnapshot;
