import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config/site';

const businessDescription =
  'Local gaming PC shop in Swartz Creek for buying gaming computers, repairing or upgrading a gaming PC, trade-ins, and in-store testing before you buy.';

const routeMeta: Record<
  string,
  {
    description: string;
    image?: string;
    title: string;
  }
> = {
  '/': {
    title: 'Gaming PCs in Swartz Creek | Buy, Trade In, Repair',
    description:
      'Shop gaming PCs in Swartz Creek, test systems before you buy a gaming computer, ask about gaming PC repair and upgrades, and explore local trade-in options for the setup you want to sell.',
    image: '/optimized/hero-storefront-dusk.jpg',
  },
  '/services': {
    title: 'Gaming PC Repair, Upgrades, and Trade-Ins in Swartz Creek',
    description:
      'Need to repair or upgrade your gaming PC? Get local diagnostics, hardware repair, performance upgrades, and trade-in guidance in Swartz Creek if you are ready to move on from your current setup.',
    image: '/optimized/storefront-interior.jpg',
  },
  '/products': {
    title: 'Buy a Gaming Computer in Swartz Creek',
    description:
      'Buy a gaming computer locally at Upgrade Gaming PCs. Browse available gaming PCs and peripherals, compare options in person, and shop with a 90 day free warranty.',
    image: '/optimized/hero-products-collage.jpg',
  },
  '/about': {
    title: 'Local Gaming PC Shop in Swartz Creek',
    description:
      'Upgrade Gaming PCs is a local gaming PC shop in Swartz Creek where you can buy, test, repair, or upgrade a gaming computer with real in-person help.',
    image: '/optimized/about-hero-main.jpg',
  },
  '/contact': {
    title: 'Contact Our Swartz Creek Gaming PC Shop',
    description:
      'Contact Upgrade Gaming PCs about buying a gaming computer, gaming PC repair, upgrades, trade-ins, and local showroom availability in Swartz Creek.',
    image: '/optimized/hero-storefront-entry.jpg',
  },
};

const toAbsoluteUrl = (path: string) => new URL(path, siteConfig.siteUrl).toString();

const setMetaTag = (selector: string, attributes: Record<string, string>, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement('meta');
    Object.entries(attributes).forEach(([name, value]) => {
      tag?.setAttribute(name, value);
    });
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = routeMeta[location.pathname] ?? routeMeta['/'];
    const pageTitle = `${meta.title} | ${siteConfig.name}`;
    const pageUrl = new URL(location.pathname, siteConfig.siteUrl).toString();
    const imageUrl = toAbsoluteUrl(meta.image ?? siteConfig.defaultSocialImagePath);
    const logoUrl = toAbsoluteUrl(siteConfig.logoPath);

    document.title = pageTitle;

    setMetaTag('meta[name="description"]', { name: 'description' }, meta.description);
    setMetaTag('meta[name="robots"]', { name: 'robots' }, 'index,follow');
    setMetaTag('meta[name="theme-color"]', { name: 'theme-color' }, '#160824');
    setMetaTag('meta[property="og:type"]', { property: 'og:type' }, 'website');
    setMetaTag('meta[property="og:site_name"]', { property: 'og:site_name' }, siteConfig.name);
    setMetaTag('meta[property="og:title"]', { property: 'og:title' }, pageTitle);
    setMetaTag('meta[property="og:description"]', { property: 'og:description' }, meta.description);
    setMetaTag('meta[property="og:url"]', { property: 'og:url' }, pageUrl);
    setMetaTag('meta[property="og:image"]', { property: 'og:image' }, imageUrl);
    setMetaTag('meta[property="og:locale"]', { property: 'og:locale' }, 'en_US');
    setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, pageTitle);
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, meta.description);
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl);

    let canonicalTag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute('href', pageUrl);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['ComputerStore', 'LocalBusiness'],
          '@id': `${siteConfig.siteUrl}/#business`,
          name: siteConfig.name,
          url: siteConfig.siteUrl,
          image: imageUrl,
          logo: logoUrl,
          description: businessDescription,
          telephone: '+1-810-441-3020',
          email: 'brandonwilson0279737@gmail.com',
          priceRange: '$$',
          sameAs: [siteConfig.facebookUrl],
          hasMap: siteConfig.googleMapsUrl,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '8048 Miller Rd Ste B',
            addressLocality: 'Swartz Creek',
            addressRegion: 'MI',
            postalCode: '48473',
            addressCountry: 'US',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 42.957475,
            longitude: -83.8324749,
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${siteConfig.siteUrl}/#website`,
          url: siteConfig.siteUrl,
          name: siteConfig.name,
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description: meta.description,
          isPartOf: {
            '@id': `${siteConfig.siteUrl}/#website`,
          },
          about: {
            '@id': `${siteConfig.siteUrl}/#business`,
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        },
      ],
    };

    let structuredDataTag = document.head.querySelector<HTMLScriptElement>('script[data-seo="local-business"]');

    if (!structuredDataTag) {
      structuredDataTag = document.createElement('script');
      structuredDataTag.type = 'application/ld+json';
      structuredDataTag.setAttribute('data-seo', 'local-business');
      document.head.appendChild(structuredDataTag);
    }

    structuredDataTag.textContent = JSON.stringify(structuredData);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
