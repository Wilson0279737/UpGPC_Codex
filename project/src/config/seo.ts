import { siteConfig } from './site';

export const routeMeta: Record<string, { title: string; description: string; image: string }> = {
  '/': {
    title: 'Gaming PCs & Computer Repair in Swartz Creek',
    description: 'Test gaming PCs before you buy in Swartz Creek, MI. Shop refurbished and custom PCs, get computer repair and upgrades, or ask about trade-ins.',
    image: '/optimized/hero-storefront-dusk.jpg',
  },
  '/services': {
    title: 'Computer Repair & PC Upgrades in Swartz Creek',
    description: 'Get local help with PC diagnostics, hardware repair, performance upgrades, and trade-ins at Upgrade Gaming PCs in Swartz Creek. Call for an estimate.',
    image: '/optimized/storefront-interior.jpg',
  },
  '/products': {
    title: 'Gaming PCs & Custom Builds in Swartz Creek',
    description: 'Browse available gaming PCs and peripherals, discuss a custom build, and test systems in our Swartz Creek showroom. View current Marketplace listings.',
    image: '/optimized/hero-products-collage.jpg',
  },
  '/about': {
    title: 'About Our Swartz Creek Gaming PC Shop',
    description: 'Meet Upgrade Gaming PCs, a local Swartz Creek shop for gaming computers, repairs, and upgrades, with hands-on testing and support after the sale.',
    image: '/optimized/about-hero-main.jpg',
  },
  '/contact': {
    title: 'Contact Upgrade Gaming PCs in Swartz Creek',
    description: 'Call (810) 441-3020 for gaming PCs, repairs, upgrades, and trade-ins. Visit Upgrade Gaming PCs at 8048 Miller Rd Ste B, Swartz Creek, MI 48473.',
    image: '/optimized/hero-storefront-entry.jpg',
  },
};

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();
export const normalizePath = (path: string) => path.toLowerCase().replace(/\/+$/, '') || '/';

export function getPageSeo(pathname: string) {
  const path = normalizePath(pathname);
  const meta = routeMeta[path];
  const title = meta ? `${meta.title} | ${siteConfig.name}` : `Page not found | ${siteConfig.name}`;
  const description = meta?.description ?? 'Find gaming PCs, repair services, and contact information at Upgrade Gaming PCs in Swartz Creek.';
  const image = absolute(meta?.image ?? siteConfig.defaultSocialImagePath);
  const canonical = meta ? absolute(path) : undefined;
  const tags = [
    { name: 'description', content: description },
    { name: 'robots', content: meta ? 'index,follow' : 'noindex,follow' },
    { name: 'theme-color', content: '#160824' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    ...(canonical ? [{ property: 'og:url', content: canonical }] : []),
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: 'Upgrade Gaming PCs in Swartz Creek, Michigan' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: 'Upgrade Gaming PCs in Swartz Creek, Michigan' },
  ];
  const businessId = `${siteConfig.siteUrl}/#business`;
  const schema = meta ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ComputerStore', '@id': businessId, name: siteConfig.name,
        url: siteConfig.siteUrl, image: absolute(siteConfig.defaultSocialImagePath), logo: absolute(siteConfig.logoPath),
        description: 'Local gaming PC shop in Swartz Creek for refurbished and custom gaming computers, computer repair, upgrades, trade-ins, and in-store testing.',
        telephone: siteConfig.telephone, email: siteConfig.email,
        sameAs: [siteConfig.facebookUrl], hasMap: siteConfig.googleMapsUrl,
        address: { '@type': 'PostalAddress', streetAddress: '8048 Miller Rd Ste B', addressLocality: 'Swartz Creek', addressRegion: 'MI', postalCode: '48473', addressCountry: 'US' },
        geo: { '@type': 'GeoCoordinates', latitude: 42.957475, longitude: -83.8324749 },
      },
      { '@type': 'WebSite', '@id': `${siteConfig.siteUrl}/#website`, url: siteConfig.siteUrl, name: siteConfig.name, publisher: { '@id': businessId } },
      {
        '@type': path === '/contact' ? 'ContactPage' : path === '/about' ? 'AboutPage' : 'WebPage',
        '@id': `${canonical}#webpage`, url: canonical, name: title, description,
        isPartOf: { '@id': `${siteConfig.siteUrl}/#website` }, about: { '@id': businessId },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
      },
      ...(path === '/services' ? ['Computer diagnostics and repair', 'Gaming PC upgrades', 'PC trade-in guidance'].map(name => ({
        '@type': 'Service', name, provider: { '@id': businessId }, areaServed: { '@type': 'City', name: 'Swartz Creek' }, url: canonical,
      })) : []),
    ],
  } : undefined;
  return { title, tags, canonical, schema };
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export function renderSeoHead(path: string) {
  const { title, tags, canonical, schema } = getPageSeo(path);
  return [
    `<title>${escapeHtml(title)}</title>`,
    ...tags.map(tag => `<meta ${'name' in tag ? `name="${tag.name}"` : `property="${tag.property}"`} content="${escapeHtml(tag.content)}" />`),
    ...(canonical ? [`<link rel="canonical" href="${escapeHtml(canonical)}" />`] : []),
    ...(schema ? [`<script type="application/ld+json" data-seo="local-business">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`] : []),
  ].join('\n    ');
}
