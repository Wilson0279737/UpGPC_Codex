import { statSync } from 'node:fs';
import path from 'node:path';
import { productProblems, siteProblems, servicesProblems, validImagePath } from '../public/admin/content-rules.js';

export function validateContent(site, services, products, publicRoot) {
  const errors = [...siteProblems(site), ...servicesProblems(services)];
  const imageExists = (value, field) => {
    // Syntax is checked by the shared rules; the build also checks the file itself.
    if (!validImagePath(value)) return;
    try {
      if (!statSync(path.join(publicRoot, value.slice(1))).isFile()) throw new Error();
    } catch { errors.push(`${field} must be an existing JPG, PNG, or WebP in uploads or optimized.`); }
  };
  imageExists(site?.home?.image, 'Home photo');
  for (const { file, data: product } of products) {
    if (!/^[a-z0-9][a-z0-9-]*\.json$/.test(file)) errors.push(`${file}: use a lowercase filename with hyphens.`);
    errors.push(...productProblems(product).map(problem => `${file}: ${problem}`));
    imageExists(product?.image, `${file}: photo`);
  }
  return errors;
}
