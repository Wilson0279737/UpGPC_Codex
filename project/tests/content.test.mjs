import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateContent } from '../scripts/content-validation.mjs';
import { visibleProducts } from '../src/lib/inventory.mjs';

const read = file => JSON.parse(readFileSync(new URL(file,import.meta.url),'utf8'));
const site = read('../src/content/site.json');
const services = read('../src/content/services.json');
const publicRoot = fileURLToPath(new URL('../public/', import.meta.url));
const pc = {title:'Test system',description:'Real system description',status:'available'};
const validate = (product = pc, override = site) => validateContent(override,services,[{file:'test-system.json',data:product}],publicRoot);

test('current site and a PC with optional pricing and no photo are valid',()=>{
  assert.deepEqual(validate(),[]);
  assert.deepEqual(validate({...pc,price:null}),[]);
});
test('public catalog hides drafts and sold systems and sorts available before reserved',()=>{
  const products=[{title:'Reserved',status:'reserved'},{title:'Draft',status:'draft'},{title:'Sold',status:'sold'},{title:'Available',status:'available'},{title:'Unknown',status:'unexpected'}];
  assert.deepEqual(visibleProducts(products).map(p=>p.title),['Available','Reserved']);
  assert.equal(products.length,5);
});
test('invalid prices and statuses block the build',()=>{
  for(const price of [-1,0,'500',NaN,Infinity,100001]) assert.ok(validate({...pc,price}).some(e=>e.includes('price')));
  assert.ok(validate({...pc,status:'oops'}).some(e=>e.includes('draft, available')));
});
test('photos require an existing local image and descriptive alternate text',()=>{
  for(const image of ['https://example.com/pc.jpg','/uploads/../secret.jpg','/uploads/missing.jpg','/uploads/pc.svg']) assert.ok(validate({...pc,image,imageAlt:'PC photo'}).some(e=>e.includes('photo')));
  assert.ok(validate({...pc,image:site.home.image}).some(e=>e.includes('photo description')));
  assert.deepEqual(validate({...pc,image:site.home.image,imageAlt:'PC photo'}),[]);
});
test('contact validation rejects email query injection and unsafe link protocols',()=>{
  const changed=structuredClone(site);changed.business.email='shop@example.com?bcc=someone@example.com';changed.business.facebookUrl='javascript:alert(1)';
  const errors=validate(pc,changed);assert.ok(errors.some(e=>e.includes('email')));assert.ok(errors.some(e=>e.includes('HTTPS')));
});
test('CMS targets the preview branch and defaults new listings to draft',()=>{
  const config=read('../public/admin/config.json');
  assert.equal(config.backend.branch,'codex/cms-preview');
  assert.deepEqual(config.backend.auth_methods,['token']);
  assert.equal(config.collections.find(c=>c.name==='products').fields.find(f=>f.name==='status').default,'draft');
  assert.equal(config.media_folder,'project/public/uploads');
});
