import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig, siteContent } from '../config/site';
import ResponsiveImage from '../components/ui/ResponsiveImage';

const AboutPage = () => (
  <div className="studio-page">
    <div className="studio-wrap">
      <section className="grid items-start gap-10 pb-14 sm:pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16" aria-labelledby="about-title">
        <div>
          <p className="studio-kicker">Your local PC shop</p>
          <h1 id="about-title" className="studio-page-title">{siteContent.about.title}</h1>
          <p className="studio-lead">{siteContent.about.description}</p>
          <p className="mt-6 max-w-xl leading-relaxed text-purple-100">{siteContent.about.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="studio-button">Explore available PCs<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link to="/services" className="studio-button-secondary">Repairs & upgrades</Link>
          </div>
        </div>
        <figure className="overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 shadow-xl sm:rounded-3xl">
          <ResponsiveImage
            src="/optimized/hero-storefront-dusk.jpg"
            sizes="(min-width: 1024px) 48vw, 100vw"
            alt="The Upgrade Gaming PCs storefront in Swartz Creek"
            className="aspect-[4/3] w-full object-cover"
            loading="eager"
          />
          <figcaption className="flex items-start gap-3 px-5 py-4 text-sm text-purple-100">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" aria-hidden="true" />
            <span>{siteConfig.streetAddress}<br />{siteConfig.city}, {siteConfig.state} {siteConfig.postalCode}</span>
          </figcaption>
        </figure>
      </section>

      <section className="grid gap-8 border-t border-white/15 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16" aria-labelledby="people-title">
        <div>
          <p className="studio-kicker">People behind the PCs</p>
          <h2 id="people-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">The people behind the shop</h2>
          <p className="mt-4 text-sm leading-relaxed text-purple-100">{siteConfig.hoursNote}</p>
          <Link to="/contact" className="studio-inline-link mt-6">Plan your visit<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <figure className="overflow-hidden rounded-2xl border border-purple-300/25 bg-purple-950/25 p-3 shadow-lg">
            <ResponsiveImage src="/optimized/about-collage-01.jpg" alt="The people behind Upgrade Gaming PCs together outdoors" sizes="(min-width: 1024px) 28vw, 50vw" className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />
            <figcaption className="mt-3 text-xs text-purple-100">The people behind the shop.</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-purple-300/25 bg-purple-950/25 p-3 shadow-lg">
            <ResponsiveImage src="/optimized/about-collage-02.jpg" alt="Renovation work while building the Upgrade Gaming PCs shop" sizes="(min-width: 1024px) 28vw, 50vw" className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />
            <figcaption className="mt-3 text-xs text-purple-100">Building the space, one step at a time.</figcaption>
          </figure>
        </div>
      </section>
    </div>
  </div>
);

export default AboutPage;
