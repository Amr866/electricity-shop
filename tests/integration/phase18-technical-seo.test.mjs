import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import {
  buildElectronicsStoreSchema,
  buildFaqPageSchema,
  buildBreadcrumbSchema,
} from '../../src/components/seo/JsonLd.tsx';

const prisma = new PrismaClient();

test('Phase 18 Seam 1: Schema.org structured data suite validation', async () => {
  const baseUrl = 'https://shiasi-electric.ir';

  // 1. ElectronicsStore / LocalBusiness Schema
  const storeSchema = buildElectronicsStoreSchema(baseUrl);
  assert.equal(storeSchema['@context'], 'https://schema.org');
  assert.equal(storeSchema['@type'], 'ElectronicsStore');
  assert.equal(storeSchema.telephone, '03142626116');
  assert.equal(storeSchema.geo.latitude, 32.6365457);
  assert.equal(storeSchema.geo.longitude, 51.3551911);
  assert.equal(storeSchema.address.addressLocality, 'نجف‌آباد');
  assert.equal(storeSchema.address.addressRegion, 'اصفهان');
  assert.equal(storeSchema.address.addressCountry, 'IR');
  assert.ok(Array.isArray(storeSchema.openingHoursSpecification));

  // 2. FAQPage Schema
  const faqSchema = buildFaqPageSchema([
    { question: 'پرسش تستی اول', answer: 'پاسخ تستی اول' },
    { question: 'پرسش تستی دوم', answer: 'پاسخ تستی دوم' },
  ]);
  assert.equal(faqSchema['@context'], 'https://schema.org');
  assert.equal(faqSchema['@type'], 'FAQPage');
  assert.equal(faqSchema.mainEntity.length, 2);
  assert.equal(faqSchema.mainEntity[0]['@type'], 'Question');
  assert.equal(faqSchema.mainEntity[0].name, 'پرسش تستی اول');
  assert.equal(faqSchema.mainEntity[0].acceptedAnswer.text, 'پاسخ تستی اول');

  // 3. BreadcrumbList Schema
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'صفحه اصلی', url: baseUrl },
    { name: 'دسته‌بندی‌ها', url: `${baseUrl}/categories` },
    { name: 'سیم و کابل', url: `${baseUrl}/categories/cables` },
  ]);
  assert.equal(breadcrumbSchema['@context'], 'https://schema.org');
  assert.equal(breadcrumbSchema['@type'], 'BreadcrumbList');
  assert.equal(breadcrumbSchema.itemListElement.length, 3);
  assert.equal(breadcrumbSchema.itemListElement[0].position, 1);
  assert.equal(breadcrumbSchema.itemListElement[2].position, 3);
  assert.equal(breadcrumbSchema.itemListElement[2].name, 'سیم و کابل');
});

test('Phase 18 Seam 2: Server layout files for client routes exist and export Metadata', async () => {
  const clientRoutes = [
    'repair-service',
    'contact',
    'faq',
    'price-lists',
    'bom-upload',
  ];

  for (const route of clientRoutes) {
    const layoutPath = path.resolve(process.cwd(), `src/app/${route}/layout.tsx`);
    assert.ok(fs.existsSync(layoutPath), `Layout for /${route} must exist at ${layoutPath}`);

    const content = fs.readFileSync(layoutPath, 'utf8');
    assert.ok(
      content.includes('export const metadata'),
      `Layout for /${route} must export const metadata`
    );
    assert.ok(
      content.includes('canonical:'),
      `Layout for /${route} must define canonical URL`
    );
    assert.ok(
      content.includes('openGraph:'),
      `Layout for /${route} must define openGraph metadata`
    );
  }
});

test('Phase 18 Seam 3: Category landing page (/categories/[slug]) architecture and sitemap harmony', async () => {
  const categoryPagePath = path.resolve(
    process.cwd(),
    'src/app/categories/[slug]/page.tsx'
  );
  assert.ok(fs.existsSync(categoryPagePath), 'Dedicated category page must exist at src/app/categories/[slug]/page.tsx');

  const pageContent = fs.readFileSync(categoryPagePath, 'utf8');
  assert.ok(pageContent.includes('export async function generateMetadata'), 'Category page must export generateMetadata');
  assert.ok(pageContent.includes('export async function generateStaticParams'), 'Category page must export generateStaticParams');
  assert.ok(pageContent.includes('BreadcrumbList'), 'Category page must inject BreadcrumbList schema');
  assert.ok(pageContent.includes('CollectionPage'), 'Category page must inject CollectionPage schema');

  // Verify categories in database can produce valid static params
  const categories = await prisma.category.findMany({ select: { slug: true } });
  assert.ok(categories.length > 0, 'Categories must exist in database');
  const params = categories.map((c) => ({ slug: c.slug }));
  assert.ok(params.every((p) => typeof p.slug === 'string' && p.slug.length > 0));
});

test('Phase 18 Seam 4: Domain resolution consistency (zero hardcoded legacy domains)', async () => {
  const productDetailPath = path.resolve(
    process.cwd(),
    'src/app/products/[slug]/page.tsx'
  );
  const detailContent = fs.readFileSync(productDetailPath, 'utf8');
  assert.ok(
    !detailContent.includes('shiasi-store.ir'),
    'Product detail page must not contain legacy shiasi-store.ir domain'
  );
  assert.ok(
    detailContent.includes('process.env.NEXT_PUBLIC_APP_URL'),
    'Product detail page must dynamically resolve NEXT_PUBLIC_APP_URL'
  );

  const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(
    !sitemapContent.includes('shiasi-store.ir'),
    'Sitemap must not contain legacy shiasi-store.ir domain'
  );
  assert.ok(
    sitemapContent.includes('/categories/${c.slug}'),
    'Sitemap must map categories to /categories/[slug]'
  );
});
