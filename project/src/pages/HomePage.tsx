import { ArrowRight, Monitor, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ActionLink from '../components/ui/ActionLink';
import { insetPanelClass, sectionEyebrowClass, sectionTitleClass } from '../components/ui/siteStyles';
import { inventory, formatPcPrice } from '../config/inventory';
import { siteConfig, siteContent } from '../config/site';

export default function HomePage() {
  const featured = [...inventory].sort((a, b) => Number(a.status === 'reserved') - Number(b.status === 'reserved')).slice(0, 3);
  return <>
    <Hero />
    <section id="on-the-floor" className="studio-wrap classic-stock" aria-labelledby="floor-title">
      <div className="studio-section-heading">
        <div><p className={sectionEyebrowClass}>In the showroom</p><h2 id="floor-title" className={`${sectionTitleClass} mt-4`}>Explore current PCs</h2></div>
        <ActionLink to="/products" variant="secondary">Shop all PCs<ArrowRight size={18} aria-hidden="true" /></ActionLink>
      </div>
      {featured.length ? <div className="studio-featured-grid">{featured.map(pc => <Link key={pc.id} className="studio-featured-pc" to={'/products#pc-' + pc.id}>
        <div className="studio-featured-photo">{pc.image ? <img src={pc.image} alt={pc.imageAlt || pc.title} width="720" height="960" loading="lazy" decoding="async" /> : <Monitor size={60} aria-hidden="true" />}<span className={`studio-stock-label ${pc.status === 'reserved' ? 'is-reserved' : ''}`}>{pc.status === 'reserved' ? 'Reserved' : 'Available'}</span></div>
        <div className="studio-featured-copy"><p>{pc.gpu || 'Everyday computing'}</p><h3>{pc.title}</h3><div><strong>{formatPcPrice(pc.price)}</strong><span>View PC<ArrowRight size={16} aria-hidden="true" /></span></div></div>
      </Link>)}</div> : <div className={insetPanelClass}><h3 className="text-xl font-semibold">Let’s find your next setup.</h3><p className="mt-3 text-purple-100">{siteContent.inventory.emptyMessage}</p><ActionLink href={siteConfig.phoneHref} className="mt-5">Call about current PCs</ActionLink></div>}
      <p className="studio-fineprint">Prices and availability can change. Contact the shop before making the trip.</p>
      <div className={`${insetPanelClass} classic-service`}>
        <div className="flex items-start gap-4"><Wrench className="mt-1 h-6 w-6 shrink-0 text-purple-300" aria-hidden="true" /><div><h2 className="text-xl font-semibold sm:text-2xl">Already have a PC?</h2><p className="mt-2 text-purple-100">Get help with repairs, upgrades, or trading in your current setup.</p></div></div>
        <ActionLink to="/services" variant="secondary">Explore services<ArrowRight size={18} aria-hidden="true" /></ActionLink>
      </div>
    </section>
  </>;
}
