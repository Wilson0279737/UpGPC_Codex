import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateContent } from '../scripts/content-validation.mjs';
import { visibleProducts, searchProducts } from '../src/lib/inventory.mjs';
import { productProblems, siteProblems, servicesProblems } from '../public/admin/content-rules.js';

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

test('catalog search matches specifications and prices sort with unknown prices last',()=>{
  const products=[{title:'PC A',status:'available',price:800,gpu:'RTX 4060'},{title:'PC B',status:'reserved',price:500,gpu:'RTX 3060'},{title:'PC C',status:'available',gpu:'RTX 4060'}];
  assert.deepEqual(searchProducts(products,{query:'RTX 4060',sort:'price-high'}).map(p=>p.title),['PC A','PC C']);
  assert.deepEqual(searchProducts(products,{availability:'available',sort:'price-low'}).map(p=>p.title),['PC A','PC C']);
  assert.deepEqual(searchProducts(products,{query:'not listed'}),[]);
});
test('photos require an existing local image and permit the PC name as alternate text',()=>{
  for(const image of ['https://example.com/pc.jpg','/uploads/../secret.jpg','/uploads/missing.jpg','/uploads/pc.svg']) assert.ok(validate({...pc,image,imageAlt:'PC photo'}).some(e=>e.includes('photo')));
  assert.deepEqual(validate({...pc,image:site.home.image}),[]);
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

test('page edits get the same field errors before saving as during a build',()=>{
  const changed=structuredClone(site);
  changed.home.title='x'.repeat(161);
  changed.business.phone='call the shop';
  changed.business.email='shop@example.com?subject=changed';
  changed.business.mapEmbedUrl='https://example.com/embed';
  const beforeSave=siteProblems(changed);
  assert.ok(beforeSave.some(e=>e.includes('heading')));
  assert.ok(beforeSave.some(e=>e.includes('phone')));
  assert.ok(beforeSave.some(e=>e.includes('email')));
  assert.ok(beforeSave.some(e=>e.includes('Google Maps embed')));
  assert.deepEqual(validateContent(changed,services,[],publicRoot),beforeSave);
});

test('service edits reject missing highlights, long buttons, and unsafe destinations before saving',()=>{
  const changed=structuredClone(services);
  changed.cards[0].points=[];
  changed.cards[0].ctaLabel='x'.repeat(101);
  changed.cards[0].ctaPath='https://example.com';
  const beforeSave=servicesProblems(changed);
  assert.ok(beforeSave.some(e=>e.includes('highlights')));
  assert.ok(beforeSave.some(e=>e.includes('button label')));
  assert.ok(beforeSave.some(e=>e.includes('destination')));
  assert.deepEqual(validateContent(site,changed,[],publicRoot),beforeSave);
});

test('invalid shapes and falsy photo values fail with useful errors instead of crashing',()=>{
  for(const invalid of [null,[],false,0,'invalid']) {
    assert.ok(productProblems(invalid).length);
    assert.ok(siteProblems(invalid).length);
    assert.ok(servicesProblems(invalid).length);
  }
  for(const image of [0,false,[],{}]) assert.ok(productProblems({...pc,image}).some(e=>e.includes('photo')));
  for(const section of ['business','home','about','contact','inventory']) {
    assert.doesNotThrow(()=>validateContent({...site,[section]:null},services,[],publicRoot));
    assert.ok(siteProblems({...site,[section]:null}).length);
  }
});

test('embedded maps accept Google embed links and reject ordinary or deceptive web links',()=>{
  for(const mapEmbedUrl of ['https://www.google.com/maps/embed?pb=example','https://www.google.com/maps/embed/v1/place?key=example&q=Swartz+Creek']) {
    assert.deepEqual(siteProblems({...site,business:{...site.business,mapEmbedUrl}}),[]);
  }
  for(const mapEmbedUrl of ['https://www.google.com/maps/place/shop','https://www.google.com.example.com/maps/embed','https://user:password@www.google.com/maps/embed','https://www.goo\ngle.com/maps/embed']) {
    assert.ok(siteProblems({...site,business:{...site.business,mapEmbedUrl}}).length);
  }
});

test('all optional product fields can be blank and valid prices include cents',()=>{
  assert.deepEqual(productProblems({...pc,price:899.99,image:'',imageAlt:'',cpu:'',gpu:'',ram:'',storage:'',marketplaceUrl:'',marketplaceVerifiedOn:''}),[]);
  assert.deepEqual(productProblems({...pc,price:''}),[]);
});

test('Marketplace buttons accept only secure Facebook item links',()=>{
  for (const marketplaceUrl of [
    'https://www.facebook.com/marketplace/item/1418206210296136/',
    'https://facebook.com/marketplace/item/4712244895764549',
    'https://m.facebook.com/marketplace/item/123/?ref=share',
    'https://web.facebook.com/marketplace/item/123/'
  ]) assert.deepEqual(productProblems({...pc,marketplaceUrl}),[]);
  for (const marketplaceUrl of [
    'javascript:alert(1)', 'http://facebook.com/marketplace/item/123/',
    'https://www.facebook.com/marketplace/profile/123/',
    'https://www.facebook.com/marketplace/search/?query=pc',
    'https://facebook.com.example.com/marketplace/item/123/',
    'https://user:password@facebook.com/marketplace/item/123/',
    'https://facebook.com:444/marketplace/item/123/',
    'https://facebook.com/marketplace/item/not-a-listing/',
    false, {}, ' https://facebook.com/marketplace/item/123/'
  ]) assert.ok(productProblems({...pc,marketplaceUrl}).some(e=>e.includes('Marketplace link')));
});

test('Marketplace check dates require an item link and a real calendar date',()=>{
  const linked={...pc,marketplaceUrl:'https://www.facebook.com/marketplace/item/123/'};
  assert.deepEqual(productProblems({...linked,marketplaceVerifiedOn:'2026-11-15'}),[]);
  assert.deepEqual(productProblems({...linked,marketplaceVerifiedOn:'2024-02-29'}),[]);
  for(const marketplaceVerifiedOn of ['2026-02-29','2026-04-31','2026-13-01','11/15/2026','2026-11-15T12:00:00Z',false,{},123]) {
    assert.ok(productProblems({...linked,marketplaceVerifiedOn}).some(e=>e.includes('real date')));
  }
  assert.ok(productProblems({...pc,marketplaceVerifiedOn:'2026-11-15'}).some(e=>e.includes('Marketplace link')));
});
