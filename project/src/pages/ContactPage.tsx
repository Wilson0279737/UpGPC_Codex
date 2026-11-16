import { ArrowRight, ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { useId, useState } from 'react';
import { siteConfig, siteContent } from '../config/site';
import ResponsiveImage from '../components/ui/ResponsiveImage';

const ContactPage = () => {
  const [mapOpen, setMapOpen] = useState(false);
  const mapId = useId();

  return (
    <div className="studio-page">
      <div className="studio-wrap">
        <header className="max-w-4xl pb-10 sm:pb-14">
          <p className="studio-kicker">Talk to a person</p>
          <h1 className="studio-page-title">{siteContent.contact.title}</h1>
          <p className="studio-lead max-w-2xl">{siteContent.contact.description}</p>
        </header>

        <div className="grid gap-8 pb-14 sm:pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <section aria-label="Contact the shop" className="divide-y divide-purple-300/20 rounded-3xl border border-purple-300/30 bg-purple-950/25 px-6 shadow-xl backdrop-blur-sm sm:px-8">
            <div className="py-7 sm:py-8">
              <h2 className="mb-3 flex items-center gap-3 text-sm font-medium text-purple-100"><Phone className="h-4 w-4 text-purple-300" aria-hidden="true" />Call the shop</h2>
              <a href={siteConfig.phoneHref} className="inline-flex min-h-11 items-center gap-4 text-2xl font-semibold tracking-tight transition-colors hover:text-purple-200 sm:text-3xl">{siteConfig.phone}<ArrowRight className="h-5 w-5" aria-hidden="true" /></a>
              <p className="mt-3 text-sm leading-relaxed text-purple-100">Ask about a PC, describe a repair, or confirm a time to stop by.</p>
            </div>
            <div className="py-7">
              <h2 className="mb-3 flex items-center gap-3 text-sm font-medium text-purple-100"><Mail className="h-4 w-4 text-purple-300" aria-hidden="true" />Email your question</h2>
              <a href={siteConfig.emailHref} className="inline-flex min-h-11 max-w-full items-center gap-3 break-all text-lg font-semibold transition-colors hover:text-purple-200 sm:text-xl">{siteConfig.email}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
              <p className="mt-3 text-sm leading-relaxed text-purple-100">Include the PC model and symptoms, or tell us your budget and the games you want to play.</p>
            </div>
            <div className="py-7">
              <h2 className="mb-3 flex items-center gap-3 text-sm font-medium text-purple-100"><MapPin className="h-4 w-4 text-purple-300" aria-hidden="true" />Visit in Swartz Creek</h2>
              <address className="text-xl not-italic font-semibold leading-relaxed">{siteConfig.streetAddress}<br />{siteConfig.city}, {siteConfig.state} {siteConfig.postalCode}</address>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-purple-100">{siteConfig.hoursNote}</p>
              <a href={siteConfig.googleMapsUrl} className="studio-inline-link mt-4">Get directions<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </section>

          <section aria-label="Find the showroom" className="self-start overflow-hidden rounded-3xl border border-purple-300/30 bg-purple-900/20 shadow-xl">
            <ResponsiveImage src="/optimized/hero-storefront-entry.jpg" alt="The entrance to Upgrade Gaming PCs on Miller Road" sizes="(min-width: 1024px) 48vw, 100vw" className="aspect-[4/3] w-full object-cover" loading="eager" />
            <div className="p-5 sm:p-6">
              <p className="text-lg font-semibold">Come see what you’re choosing.</p>
              <p className="mb-5 mt-2 text-sm leading-relaxed text-purple-100">Try gaming PCs in the showroom and talk through your options face to face.</p>
              <button type="button" className="studio-button-secondary w-full justify-between" aria-expanded={mapOpen} aria-controls={mapId} onClick={() => setMapOpen((open) => !open)}>
                {mapOpen ? 'Hide location map' : 'Show location map'}<ChevronDown className={`h-4 w-4 ${mapOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </div>
            <div id={mapId} hidden={!mapOpen}>
              {mapOpen && <iframe src={siteConfig.mapEmbedUrl} title="Map showing the Upgrade Gaming PCs showroom" className="h-80 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
