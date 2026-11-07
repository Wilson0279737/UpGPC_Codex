import { existsSync } from 'node:fs';
import path from 'node:path';

export function validateContent(site, services, products, publicRoot) {
  const errors = [];
  const text = (value, field, max = 3000, required = true) => {
    if (value == null || value === '') { if (required) errors.push(`${field} is required`); return; }
    if (typeof value !== 'string' || !value.trim() || value.length > max) errors.push(`${field} must be text, 1–${max} characters`);
  };
  const image = (value, field, required = false) => {
    if (!value && !required) return;
    if (typeof value !== 'string' || !/^\/(?:uploads|optimized)\/[a-zA-Z0-9_ /.-]+\.(?:png|jpe?g|webp)$/i.test(value) || value.includes('..') || !existsSync(path.join(publicRoot, value.slice(1)))) errors.push(`${field} must be an existing JPG, PNG, or WebP in uploads or optimized`);
  };
  const url = (value, field) => {
    try { const u = new URL(value); if (u.protocol !== 'https:' || u.username || u.password) throw new Error(); } catch { errors.push(`${field} must be a valid HTTPS URL`); }
  };
  if (!site?.business || !site?.home || !site?.about || !site?.contact || !site?.inventory) return ['Website content is missing a required section'];
  for (const section of ['home','about','contact','inventory']) {
    text(site[section].title, `${section}: heading`, 160);
    text(site[section].description, `${section}: introduction`);
  }
  text(site.about.body, 'About: story', 6000);
  text(site.inventory.emptyMessage, 'Inventory: empty message');
  image(site.home.image, 'Home: photo', true);
  text(site.home.imageAlt, 'Home: photo description', 300);
  for (const key of ['phone','email','streetAddress','city','state','postalCode','hoursNote']) text(site.business[key], `Contact: ${key}`, key === 'hoursNote' ? 1000 : 200);
  if (typeof site.business.phone !== 'string' || !/^[+()\d .-]+$/.test(site.business.phone) || !/^\d{10,15}$/.test(site.business.phone.replace(/\D/g,''))) errors.push('Contact: phone must contain 10–15 digits');
  if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(site.business.email)) errors.push('Contact: email is invalid');
  for (const key of ['googleMapsUrl','mapEmbedUrl','facebookUrl','marketplaceUrl']) url(site.business[key], `Contact: ${key}`);
  text(services?.title, 'Services: heading', 160);
  text(services?.description, 'Services: introduction');
  if (!Array.isArray(services?.cards) || services.cards.length < 1 || services.cards.length > 8) errors.push('Services: add 1–8 cards');
  for (const [index, card] of (Array.isArray(services?.cards) ? services.cards : []).entries()) {
    const field = `Service ${index + 1}`;
    if (!card || typeof card !== 'object') { errors.push(`${field} is invalid`); continue; }
    text(card.title, `${field}: name`, 160); text(card.description, `${field}: description`); text(card.ctaLabel, `${field}: button label`, 100);
    if (!['repair','computer'].includes(card.icon)) errors.push(`${field}: choose a repair or computer icon`);
    if (!['/contact','/products','/services','/about'].includes(card.ctaPath)) errors.push(`${field}: invalid button destination`);
    if (!Array.isArray(card.points) || card.points.length < 1 || card.points.length > 8) errors.push(`${field}: add 1–8 highlights`);
    for (const point of Array.isArray(card.points) ? card.points : []) text(point, `${field}: highlight`, 300);
  }
  for (const { file, data: product } of products) {
    if (!/^[a-z0-9][a-z0-9-]*\.json$/.test(file)) errors.push(`${file}: use a lowercase filename with hyphens`);
    if (!product || typeof product !== 'object') { errors.push(`${file}: PC data is invalid`); continue; }
    text(product.title, `${file}: name`, 160); text(product.description, `${file}: description`, 6000);
    if (!['draft','available','reserved','sold'].includes(product.status)) errors.push(`${file}: choose draft, available, reserved, or sold`);
    if (product.price != null && product.price !== '' && (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0.01 || product.price > 100000)) errors.push(`${file}: price must be a number between $0.01 and $100,000, or blank`);
    image(product.image, `${file}: photo`);
    if (product.image) text(product.imageAlt, `${file}: photo description`, 300);
    for (const key of ['cpu','gpu','ram','storage']) text(product[key], `${file}: ${key}`, 300, false);
  }
  return errors;
}
