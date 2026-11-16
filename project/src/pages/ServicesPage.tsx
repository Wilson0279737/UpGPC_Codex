import { ArrowRight, Monitor, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import services from '../content/services.json';
import { siteConfig } from '../config/site';

const ServicesPage = () => (
  <div className="studio-page brand-services">
    <div className="studio-wrap">
      <header className="brand-route-intro max-w-4xl pb-12 sm:pb-16">
        <p className="studio-kicker">Repairs / upgrades / trade-ins</p>
        <h1 className="studio-page-title">{services.title}</h1>
        <p className="studio-lead max-w-2xl">{services.description}</p>
      </header>

      <section aria-label="How we can help" className="space-y-5">
        {services.cards.map((service, index) => {
          const Icon = service.icon === 'repair' ? Wrench : Monitor;
          return (
            <article key={service.title} className="brand-service-band relative isolate grid gap-6 overflow-hidden rounded-3xl border border-[var(--studio-line)] bg-[var(--studio-surface)] px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.8fr_1fr_0.75fr] lg:gap-10">
              <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 -z-10 h-1 w-1/2 bg-gradient-to-l from-[#7bdcff] to-transparent" />
              <div>
                <div className="mb-5 flex items-center gap-4 text-[var(--studio-accent)]">
                  <span className="font-mono text-4xl font-light tracking-tighter">0{index + 1}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--studio-line)] bg-[var(--studio-bg)]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                </div>
                <h2 className="max-w-sm text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{service.title}</h2>
              </div>
              <div>
                <p className="max-w-lg leading-relaxed text-[var(--studio-muted)]">{service.description}</p>
                <ul className="mt-6 space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--studio-accent)]" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-end lg:justify-end">
                <Link to={service.ctaPath} className="studio-button-secondary">
                  {service.ctaLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="service-next-steps" className="py-14 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="studio-kicker">Start with a conversation</p>
            <h2 id="service-next-steps" className="text-3xl font-semibold tracking-tight sm:text-4xl">A useful next step, without the guesswork.</h2>
          </div>
          <a href={siteConfig.phoneHref} className="studio-inline-link shrink-0">Call {siteConfig.phone}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
        <ol className="brand-service-steps grid gap-4 sm:grid-cols-3">
          {[
            ['Tell us what’s happening', 'Have your PC model, the problem, or your upgrade goal ready. You don’t need to know the technical answer.'],
            ['Talk through the options', 'Ask about a repair, replacement, trade-in, or a build that fits your budget and the way you use your PC.'],
            ['Choose your next step', 'Get directions, arrange a visit, or take a closer look at the systems currently available.'],
          ].map(([title, description], index) => (
            <li key={title} className="rounded-2xl border border-[var(--studio-line)] bg-[var(--studio-surface)] p-6">
              <span className="font-mono text-xs text-[var(--studio-accent)]">0{index + 1}</span>
              <h3 className="mb-2 mt-4 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--studio-muted)]">{description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  </div>
);

export default ServicesPage;
