import { mkdir, readFile, readdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateContent } from './content-validation.mjs';
import { visibleProducts } from '../src/lib/inventory.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = async name => JSON.parse(await readFile(path.join(root, name), 'utf8'));
const productFiles = (await readdir(path.join(root, 'src/content/products'))).filter(file => file.endsWith('.json'));
const products = await Promise.all(productFiles.map(async file => ({file, data: await read(`src/content/products/${file}`)})));
const site = await read('src/content/site.json');
const errors = validateContent(site, await read('src/content/services.json'), products, path.join(root,'public'));
if (errors.length) { console.error('Please correct these CMS fields:\n' + errors.map(error => `- ${error}`).join('\n')); process.exit(1); }
await writeFile(path.join(root, 'src/content/catalog.generated.json'), JSON.stringify(visibleProducts(products.map(({file,data})=>({...data,id:file.replace(/\.json$/,'')}))),null,2));

// Recreate only generated practice seed data inside this checkout.
const seedRoot = path.join(root, 'public/admin/seed');
await rm(seedRoot, { recursive: true, force: true });
await mkdir(seedRoot, { recursive: true });
const files = ['src/content/site.json', 'src/content/services.json'];
const assets = new Set([site.home.image]);
for (const asset of assets) files.push(`public${asset}`);
for (const file of files) {
  const target = path.join(seedRoot,'project',file);
  await mkdir(path.dirname(target),{recursive:true});
  await copyFile(path.join(root,file),target);
}
const sampleFile = 'project/src/content/products/practice-pc.json';
await mkdir(path.dirname(path.join(seedRoot,sampleFile)),{recursive:true});
await writeFile(path.join(seedRoot,sampleFile),JSON.stringify({title:'Practice PC — example only',status:'draft',description:'A sample for trying the editor. Replace these details with a real system when editing your actual inventory.',cpu:'Example processor',gpu:'Example graphics',ram:'Example memory',storage:'Example storage'},null,2));
await writeFile(path.join(seedRoot,'manifest.json'),JSON.stringify({files: [...files.map(file=>`project/${file}`),sampleFile]},null,2));
console.log(`CMS content checked: ${products.length} PC listings. Practice editor seed refreshed.`);
