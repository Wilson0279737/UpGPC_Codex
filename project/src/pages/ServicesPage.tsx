import { ArrowRight, Monitor, Wrench } from 'lucide-react';
import services from '../content/services.json';
import { siteConfig } from '../config/site';
import ActionLink from '../components/ui/ActionLink';
import { cardClass, iconBadgeClass, insetPanelClass } from '../components/ui/siteStyles';

const ServicesPage = () => (
  <div className="studio-page">
    <div className="studio-wrap">
      <header className="max-w-4xl pb-10 sm:pb-12">
        <p className="studio-kicker">Repairs / upgrades / trade-ins</p>
        <h1 className="studio-page-title">{services.title}</h1>
        <p className="studio-lead max-w-2xl">{services.description}</p>
      </header>

      <section aria-label="How we can help" className="grid gap-5 md:grid-cols-2 md:gap-8">
        {services.cards.map((service) => {
          const Icon = service.icon === 'repair' ? Wrench : Monitor;
          return (
            <article key={service.title} className={`${cardClass} flex flex-col`}>
              <div>
                <div className={iconBadgeClass}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl">{service.title}</h2>
              </div>
              <div className="flex-1">
                <p className="mt-3 text-sm leading-relaxed text-purple-100 sm:text-base">{service.description}</p>
                <ul className="mt-4 space-y-3 sm:mt-5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-purple-100">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-300" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 sm:mt-6">
                <ActionLink to={service.ctaPath} variant="secondary" className="w-full sm:w-auto">
                  {service.ctaLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ActionLink>
              </div>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="service-next-steps" className={`mt-6 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:items-center lg:justify-between ${insetPanelClass}`}>
        <div>
          <h2 id="service-next-steps" className="text-xl font-semibold text-white sm:text-2xl">Not sure where to start?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-purple-100 sm:text-base">Tell us your PC model, what’s happening, or what you’d like to upgrade. Have your budget and the games you play in mind, and we can talk through the next step.</p>
        </div>
        <ActionLink href={siteConfig.phoneHref} className="w-full shrink-0 sm:w-auto">Call {siteConfig.phone}<ArrowRight className="h-4 w-4" aria-hidden="true" /></ActionLink>
      </section>
    </div>
  </div>
);

export default ServicesPage;
