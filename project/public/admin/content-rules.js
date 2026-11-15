// Keep the editor's pre-save checks and the build's content checks in sync.
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function text(errors, value, field, max = 3000, required = true) {
  if (value == null || value === '') {
    if (required) errors.push(`${field} is required.`);
    return;
  }
  if (typeof value !== 'string' || !value.trim() || value.length > max) errors.push(`${field} must contain 1–${max} characters.`);
}

export function validImagePath(value) {
  return typeof value === 'string'
    && /^\/(?:uploads|optimized)\/[a-zA-Z0-9_ /.-]+\.(?:png|jpe?g|webp)$/i.test(value)
    && !value.includes('..');
}

function image(errors, value, field, required = false) {
  if ((value == null || value === '') && !required) return;
  if (!validImagePath(value)) errors.push(`${field}: choose a JPG, PNG, or WebP from the image library.`);
}

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return typeof value === 'string' && value.length <= 4000 && !/[\u0000-\u0020\u007f]/.test(value)
      && url.protocol === 'https:' && !url.username && !url.password && !!url.hostname;
  } catch { return false; }
}

export function validMarketplaceUrl(value) {
  if (!httpsUrl(value)) return false;
  const url = new URL(value);
  return ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'web.facebook.com'].includes(url.hostname)
    && !url.port && /^\/marketplace\/item\/\d+\/?$/.test(url.pathname);
}

export function productProblems(product) {
  const errors = [];
  if (!record(product)) return ['This PC entry is invalid.'];
  text(errors, product.title, 'PC name', 160);
  text(errors, product.description, 'Description', 6000);
  if (!['draft', 'available', 'reserved', 'sold'].includes(product.status)) errors.push('Choose draft, available, reserved, or sold.');
  if (product.price != null && product.price !== '' && (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0.01 || product.price > 100000)) errors.push('The price must be a number from $0.01 to $100,000, or blank.');
  image(errors, product.image, 'PC photo');
  text(errors, product.imageAlt, 'Photo description', 300, false);
  for (const key of ['cpu', 'gpu', 'ram', 'storage']) text(errors, product[key], key, 300, false);
  const hasMarketplaceUrl = product.marketplaceUrl != null && product.marketplaceUrl !== '';
  if (hasMarketplaceUrl && !validMarketplaceUrl(product.marketplaceUrl)) errors.push('Marketplace link must be an HTTPS Facebook Marketplace item URL, not a profile or search page.');
  if (product.marketplaceVerifiedOn != null && product.marketplaceVerifiedOn !== '') {
    const date = product.marketplaceVerifiedOn;
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
      || !Number.isFinite(Date.parse(`${date}T00:00:00Z`))
      || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) errors.push('Marketplace check date must be a real date in YYYY-MM-DD format.');
    if (!hasMarketplaceUrl) errors.push('Add this PC’s Marketplace link before recording its check date.');
  }
  return errors;
}

export function siteProblems(site) {
  const errors = [];
  if (!record(site) || ['business', 'home', 'about', 'contact', 'inventory'].some(section => !record(site[section]))) return ['Website content is missing a required section.'];
  for (const section of ['home', 'about', 'contact', 'inventory']) {
    text(errors, site[section].title, `${section}: heading`, 160);
    text(errors, site[section].description, `${section}: introduction`);
  }
  text(errors, site.about.body, 'About: story', 6000);
  text(errors, site.inventory.emptyMessage, 'Inventory: empty message');
  image(errors, site.home.image, 'Home photo', true);
  text(errors, site.home.imageAlt, 'Home: photo description', 300);
  for (const key of ['phone', 'email', 'streetAddress', 'city', 'state', 'postalCode', 'hoursNote']) text(errors, site.business[key], `Contact: ${key}`, key === 'hoursNote' ? 1000 : 200);
  if (typeof site.business.phone !== 'string' || !/^[+()\d .-]+$/.test(site.business.phone) || !/^\d{10,15}$/.test(site.business.phone.replace(/\D/g, ''))) errors.push('Contact: phone must contain 10–15 digits.');
  if (typeof site.business.email !== 'string' || !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(site.business.email)) errors.push('Contact: email is invalid.');
  for (const key of ['googleMapsUrl', 'mapEmbedUrl', 'facebookUrl', 'marketplaceUrl']) {
    if (!httpsUrl(site.business[key])) errors.push(`Contact: ${key} must be a valid HTTPS URL.`);
  }
  if (httpsUrl(site.business.mapEmbedUrl)) {
    const embed = new URL(site.business.mapEmbedUrl);
    if (!['www.google.com', 'maps.google.com', 'google.com'].includes(embed.hostname) || !/^\/maps\/embed(?:\/|$)/.test(embed.pathname)) errors.push('Contact: embedded map must use a Google Maps embed URL. Use Share → Embed a map in Google Maps.');
  }
  return errors;
}

export function servicesProblems(services) {
  if (!record(services)) return ['Service content is invalid.'];
  const errors = [];
  text(errors, services.title, 'Services: heading', 160);
  text(errors, services.description, 'Services: introduction');
  if (!Array.isArray(services.cards) || services.cards.length < 1 || services.cards.length > 8) errors.push('Services: add 1–8 cards.');
  for (const [index, card] of (Array.isArray(services.cards) ? services.cards : []).entries()) {
    const field = `Service ${index + 1}`;
    if (!record(card)) { errors.push(`${field} is invalid.`); continue; }
    text(errors, card.title, `${field}: name`, 160);
    text(errors, card.description, `${field}: description`);
    text(errors, card.ctaLabel, `${field}: button label`, 100);
    if (!['repair', 'computer'].includes(card.icon)) errors.push(`${field}: choose a repair or computer icon.`);
    if (!['/contact', '/products', '/services', '/about'].includes(card.ctaPath)) errors.push(`${field}: invalid button destination.`);
    if (!Array.isArray(card.points) || card.points.length < 1 || card.points.length > 8) errors.push(`${field}: add 1–8 highlights.`);
    for (const point of Array.isArray(card.points) ? card.points : []) text(errors, point, `${field}: highlight`, 300);
  }
  return errors;
}
