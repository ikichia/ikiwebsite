/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const Module=require('node:module');
const path=require('node:path');
const filename=path.resolve('src/sanity/public-model.ts');
const loaded=new Module(filename,module); loaded.filename=filename; loaded.paths=module.paths;
loaded._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const {toPublicProperty}=loaded.exports;
const record={_id:'example',referenceId:'IKI-example',slug:{current:'example-property'},title:'Example property',description:'Public description',area:'Johor Bahru',state:'Johor',category:'residential',subtype:'house',transactionType:'rent',currency:'MYR',askingPrice:2000,status:'available',showOnWebsite:true,publicApproved:true,lastVerifiedDate:'2026-11-14',photos:[{asset:{_type:'reference',_ref:'image-abcd1234-600x450-webp'}}]};
const map=r=>toPublicProperty(r,()=>'/test-photo.webp');
test('public mapper preserves language fallback, shared data and optional fields',()=>{const p=map(record);assert.equal(p.title.zh,record.title);assert.equal(p.description.zh,record.description);assert.equal(p.deal,'rent');assert.equal(p.bedrooms,undefined);assert.equal(p.id,"sanity:"+record.referenceId);});
test('excludes drafts, hidden, unreviewed and inactive listings',()=>{for(const patch of [{_id:'drafts.example'},{_id:'versions.release.example'},{showOnWebsite:false},{publicApproved:false},{status:'sold'},{status:'rented'},{askingPrice:-1},{currency:'USD'},{photos:[]}])assert.equal(map({...record,...patch}),null);assert(map({...record,status:'reserved'}));});
test('private extra fields cannot leak through mapping',()=>{const p=map({...record,ownerPhone:'PRIVATE',unitNumber:'PRIVATE',privateNotes:'PRIVATE',photos:[{...record.photos[0],secret:'PRIVATE',asset:{...record.photos[0].asset,secret:'PRIVATE'}}]});assert(!JSON.stringify(p).includes('PRIVATE'));});
test('new projects preserve base category and cover photo order',()=>{const p=map({...record,newProject:true});assert.equal(p.category,'new-projects');assert.equal(p.baseCategory,'residential');assert.equal(p.photos[0].asset._ref,record.photos[0].asset._ref);});
function importTs(relativePath, mocks) {
  const filename = path.resolve(relativePath);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = module.paths;
  const requireFromModule = loaded.require.bind(loaded);
  loaded.require = name => Object.hasOwn(mocks, name) ? mocks[name] : requireFromModule(name);
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS},
  }).outputText, filename);
  return loaded.exports;
}

test('public listing reader reflects published changes and keeps an empty CMS empty', async t => {
  let published = [];
  const photo2 = {asset: {_type: 'reference', _ref: 'image-efgh5678-600x450-webp'}};
  const query = importTs('src/sanity/queries.ts', {}).publishedPropertyQuery;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url.hostname, 'example.api.sanity.io');
    assert.equal(url.pathname, '/v2026-11-01/data/query/testing');
    assert.equal(url.searchParams.get('perspective'), 'published');
    assert.equal(url.searchParams.get('query'), query);
    assert.equal(options.cache, 'no-store');
    return Response.json({result: published});
  });
  const reader = importTs('src/sanity/public-reader.ts', {
    './settings': {validateSanityConfig: importTs('src/sanity/settings.ts', {}).validateSanityConfig, studioProjectId: 'example', studioDataset: 'testing', apiVersion: '2026-11-01'},
    './images': {marketingImageUrl: photo => photo.asset._ref},
    './public-model': {toPublicProperty},
    './queries': {publishedPropertyQuery: query},
  });
  const site = importTs('src/lib/site.ts', {});
  const {listPublicProperties, readFilters} = importTs('src/lib/properties.ts', {
    './site': site,
    '../sanity/public-reader': reader,
  });

  assert.deepEqual(await listPublicProperties(), []);
  published = [{...record, photos: [...record.photos, photo2], featured: true}];
  const rental = readFilters({deal: 'rent', area: 'johor', budget: '2100'});
  const [listing] = await listPublicProperties(rental);
  assert.equal(listing.price, 2000);
  assert.equal(listing.photos.length, 2);
  assert.equal(listing.photo, record.photos[0].asset._ref);
  assert.equal(listing.featured, true);
  assert.deepEqual(await listPublicProperties(readFilters({deal: 'buy'})), []);

  const updated = {...published[0], askingPrice: 2200, title: 'Updated listing'};
  published = [updated];
  assert.deepEqual(await listPublicProperties(rental), []);
  assert.equal((await listPublicProperties())[0].title.en, 'Updated listing');

  published = [];
  assert.deepEqual(await listPublicProperties(), []);
  published = [updated];
  assert.equal((await listPublicProperties())[0].price, 2200);
  published = [
    updated,
    {...updated, referenceId: 'duplicate'},
    {...updated, slug: {current: 'second-slug'}},
    {...updated, referenceId: 'commercial-rent', slug: {current: 'commercial-rent'}, category: 'commercial'},
  ];
  const all = await listPublicProperties(readFilters({category: 'room-rental'}));
  assert.equal(all.length, 2);
  assert.equal(all[0].slug, record.slug.current);
  assert.equal(all[1].category, 'commercial');
});
test('Sanity dataset matches the deployment environment', () => {
  const {validateSanityConfig} = importTs('src/sanity/settings.ts', {});
  const validate = (environment, dataset) => validateSanityConfig('c3sa9z6o', dataset, environment);
  assert.doesNotThrow(() => validate('production', 'production'));
  assert.doesNotThrow(() => validate('preview', 'testing'));
  assert.throws(() => validate('production', 'testing'), /production.*requires.*production/);
  assert.throws(() => validate('preview', 'production'), /preview.*requires.*testing/);
  assert.throws(() => validate('production', undefined), /NEXT_PUBLIC_SANITY_DATASET is required/);
  assert.throws(() => validate('preview', 'staging'), /production.*testing|testing.*production/);
  assert.doesNotThrow(() => validate(undefined, 'testing'));
  assert.throws(() => validate(undefined, 'production'), /development.*requires.*testing/);
  assert.throws(() => validateSanityConfig('c3sa9z6o', 'testing', undefined, '1'), /VERCEL_ENV is required/);
});
