import { ArrowRight, Monitor, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import services from '../content/services.json';
import { siteConfig } from '../config/site';

const ServicesPage = () => (
  <div className="studio-page">
    <div className="studio-wrap">
      <header className="max-w-4xl pb-12 sm:pb-16">
        <p className="studio-kicker">Repairs / upgrades / trade-ins</p>
        <h1 className="studio-page-title">{services.title}</h1>
        <p className="studio-lead max-w-2xl">{services.description}</p>
      </header>

      <section aria-label="How we can help" className="divide-y divide-white/15 border-y border-white/15">
        {services.cards.map((service, index) => {
          const Icon = service.icon === 'repair' ? Wrench : Monitor;
          return (
            <article key={service.title} className="grid gap-6 py-10 sm:py-12 lg:grid-cols-[0.8fr_1fr_0.75fr] lg:gap-10">
              <div>
                <div className="mb-5 flex items-center gap-4 text-[#d4fa58]">
                  <span className="font-mono text-xs">0{index + 1}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="max-w-sm text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{service.title}</h2>
              </div>
              <div>
                <p className="max-w-lg leading-relaxed text-[#b9c4bf]">{service.description}</p>
                <ul className="mt-6 space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4fa58]" aria-hidden="true" />
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
        <ol className="grid gap-6 sm:grid-cols-3">
          {[
            ['Tell us what’s happening', 'Have your PC model, the problem, or your upgrade goal ready. You don’t need to know the technical answer.'],
            ['Talk through the options', 'Ask about a repair, replacement, trade-in, or a build that fits your budget and the way you use your PC.'],
            ['Choose your next step', 'Get directions, arrange a visit, or take a closer look at the systems currently available.'],
          ].map(([title, description], index) => (
            <li key={title} className="border-t border-white/15 pt-5">
              <span className="font-mono text-xs text-[#d4fa58]">0{index + 1}</span>
              <h3 className="mb-2 mt-4 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-[#b9c4bf]">{description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  </div>
);

export default ServicesPage;
