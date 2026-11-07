import { siteConfig } from '../config/site';
import { Cpu, Monitor, Shield, Zap } from 'lucide-react';
import ActionLink from './ui/ActionLink';
import SectionHeader from './ui/SectionHeader';
import { cardClass, iconBadgeClass, insetPanelClass, sectionEyebrowClass } from './ui/siteStyles';

const products = [
  {
    title: 'Ready-to-play systems',
    description: 'Refurbished gaming PCs that are cleaned, tested, and ready for the next session.',
    icon: Monitor,
  },
  {
    title: 'Custom build guidance',
    description: 'Talk through budget, performance goals, and upgrade paths before committing.',
    icon: Cpu,
  },
  {
    title: '90 day free warranty',
    description: 'Every system includes a 90 day free warranty and direct support from the same local team.',
    icon: Shield,
  },
];

type ProductsShowcaseProps = {
  showHeader?: boolean;
};

const ProductsShowcase = ({ showHeader = true }: ProductsShowcaseProps) => {
  return (
    <section id="products" className="relative scroll-mt-28 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showHeader ? (
          <SectionHeader
            eyebrow="Products"
            title="Gaming PCs you can test before you take them home"
            description="Compare ready-to-play systems, ask about custom options, and get straightforward advice based on your budget and favorite games."
            className="max-w-3xl"
          />
        ) : null}

        <div className={`${showHeader ? 'mt-8 sm:mt-10' : ''} grid gap-5 lg:grid-cols-3`}>
          {products.map((product) => {
            const Icon = product.icon;

            return (
              <article key={product.title} className={cardClass}>
                <div className={iconBadgeClass}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl">{product.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-purple-100 sm:text-base">{product.description}</p>
              </article>
            );
          })}
        </div>

        <div className={`mt-6 flex flex-col gap-5 sm:mt-8 lg:flex-row lg:items-center lg:justify-between ${insetPanelClass}`}>
          <div className="max-w-2xl">
            <div className={sectionEyebrowClass}>
              <Zap className="h-4 w-4" />
              <span>Best for first-time buyers and upgrade shoppers</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white sm:mt-5 sm:text-2xl">Want help choosing the right system?</h3>
            <p className="mt-3 text-purple-100">
              Tell the shop what games you play, your budget, and whether you want a ready-built or a custom path.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionLink to="/contact" className="w-full sm:w-auto">
              Ask for a recommendation
            </ActionLink>
            <ActionLink href={siteConfig.phoneHref} variant="secondary" className="w-full sm:w-auto">
              Call the showroom
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;
