import serviceContent from '../content/services.json';
import { siteConfig } from '../config/site';
import { Monitor, Wrench } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import { cardClass, iconBadgeClass, insetPanelClass } from './ui/siteStyles';

const services = serviceContent.cards;

type ServicesSnapshotProps = {
  showHeader?: boolean;
};

const ServicesSnapshot = ({ showHeader = true }: ServicesSnapshotProps) => {
  return (
    <section id="services" className="relative py-14 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          {showHeader ? (
            <SectionHeader
              eyebrow="Services"
              title={serviceContent.title}
              description={serviceContent.description}
              align="center"
              className="mx-auto max-w-3xl"
            />
          ) : null}

          <div className={`${showHeader ? 'mt-8 md:mt-10' : ''} grid gap-5 md:grid-cols-2 md:gap-8`}>
            {services.map((service) => {
              const Icon = service.icon === 'repair' ? Wrench : Monitor;

              return (
                <article key={service.title} className={`${cardClass} flex h-full flex-col`}>
                  <div className={iconBadgeClass}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl">{service.title}</h3>
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
                    <ActionLink to={service.ctaPath} variant="secondary" className="w-full sm:w-auto">
                      <span>{service.ctaLabel}</span>
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

export default ServicesSnapshot;
