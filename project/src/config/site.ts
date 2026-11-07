import content from '../content/site.json';

const { business } = content;
const phoneDigits = business.phone.replace(/\D/g, '');

export const siteContent = content;
export const siteConfig = {
  ...business,
  phoneHref: `tel:+${phoneDigits.length === 10 ? '1' : ''}${phoneDigits}`,
  emailHref: `mailto:${business.email}`,
  address: `${business.streetAddress}, ${business.city}, ${business.state} ${business.postalCode}`,
  defaultSocialImagePath: '/optimized/hero-storefront-dusk.jpg',
  logoPath: '/site-pics/logo.png',
  name: 'Upgrade Gaming PCs',
  siteUrl: 'https://upgradegamingpcs.com',
} as const;

