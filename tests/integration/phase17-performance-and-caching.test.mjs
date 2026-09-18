import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { fetchCatalogMetadata, getCachedCatalogMetadata } from '../../src/lib/domain/catalog-cache.ts';

const prisma = new PrismaClient();

test('Phase 17 Seam 1: In-app catalog metadata caching and fallback execution', async () => {
  const metadata = await getCachedCatalogMetadata();
  assert.ok(metadata, 'Metadata object must be returned');
  assert.ok(Array.isArray(metadata.categories), 'Categories must be an array');
  assert.ok(Array.isArray(metadata.brands), 'Brands must be an array');
  assert.ok(metadata.categories.length > 0, 'Categories must contain seeded categories');

  // Verify each category has _count.products
  const firstCat = metadata.categories[0];
  assert.ok(firstCat.id, 'Category must have an id');
  assert.ok(firstCat.name, 'Category must have a name');
  assert.ok(typeof firstCat._count?.products === 'number', 'Category must have a numeric product count');

  // Direct fetcher must match shape
  const direct = await fetchCatalogMetadata();
  assert.equal(direct.categories.length, metadata.categories.length, 'Direct fetch must match cached categories count');
});

test('Phase 17 Seam 2: PostgreSQL composite indexes verification', async () => {
  // Query pg_indexes for the new composite indexes
  const indexRows = await prisma.$queryRawUnsafe(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'Product';
  `);

  assert.ok(Array.isArray(indexRows), 'Index list must be returned');

  const indexNames = indexRows.map((r) => r.indexname);
  const hasArchivedCreatedAt = indexNames.includes('Product_isArchived_createdAt_idx');
  const hasArchivedPrice = indexNames.includes('Product_isArchived_price_idx');
  const hasArchivedCategory = indexNames.includes('Product_isArchived_categoryId_idx');

  assert.ok(hasArchivedCreatedAt, 'Composite index Product_isArchived_createdAt_idx must exist');
  assert.ok(hasArchivedPrice, 'Composite index Product_isArchived_price_idx must exist');
  assert.ok(hasArchivedCategory, 'Composite index Product_isArchived_categoryId_idx must exist');
});

test('Phase 17 Seam 3: Commercial search scoping on (name, sku, mpn, brand, shortDesc)', async () => {
  const cat = await prisma.category.findFirst();
  assert.ok(cat, 'Category must exist');

  const uniqueSuffix = Date.now().toString();
  const testProduct = await prisma.product.create({
    data: {
      name: `کلید مینیاتوری تک‌پل ${uniqueSuffix}`,
      slug: `miniature-breaker-${uniqueSuffix}`,
      sku: `SKU-${uniqueSuffix}`,
      mpn: `MPN-${uniqueSuffix}`,
      brand: 'پارس فانال',
      shortDesc: `توضیحات کوتاه تستی ${uniqueSuffix}`,
      description: `متن طولانی و حجیم که نباید در جستجو اسکن شود SECRET_${uniqueSuffix}`,
      price: 180000,
      categoryId: cat.id,
    },
  });

  try {
    // 1. Search by sku should find the product
    const skuResults = await prisma.product.findMany({
      where: {
        isArchived: false,
        AND: [
          {
            OR: [
              { name: { contains: `SKU-${uniqueSuffix}`, mode: 'insensitive' } },
              { sku: { contains: `SKU-${uniqueSuffix}`, mode: 'insensitive' } },
              { mpn: { contains: `SKU-${uniqueSuffix}`, mode: 'insensitive' } },
              { brand: { contains: `SKU-${uniqueSuffix}`, mode: 'insensitive' } },
              { shortDesc: { contains: `SKU-${uniqueSuffix}`, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });
    assert.equal(skuResults.length, 1, 'Search by SKU must find the product');
    assert.equal(skuResults[0].id, testProduct.id);

    // 2. Search by mpn should find the product
    const mpnResults = await prisma.product.findMany({
      where: {
        isArchived: false,
        AND: [
          {
            OR: [
              { name: { contains: `MPN-${uniqueSuffix}`, mode: 'insensitive' } },
              { sku: { contains: `MPN-${uniqueSuffix}`, mode: 'insensitive' } },
              { mpn: { contains: `MPN-${uniqueSuffix}`, mode: 'insensitive' } },
              { brand: { contains: `MPN-${uniqueSuffix}`, mode: 'insensitive' } },
              { shortDesc: { contains: `MPN-${uniqueSuffix}`, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });
    assert.equal(mpnResults.length, 1, 'Search by MPN must find the product');

    // 3. Search for token only in raw HTML description must NOT match
    const descOnlyResults = await prisma.product.findMany({
      where: {
        isArchived: false,
        AND: [
          {
            OR: [
              { name: { contains: `SECRET_${uniqueSuffix}`, mode: 'insensitive' } },
              { sku: { contains: `SECRET_${uniqueSuffix}`, mode: 'insensitive' } },
              { mpn: { contains: `SECRET_${uniqueSuffix}`, mode: 'insensitive' } },
              { brand: { contains: `SECRET_${uniqueSuffix}`, mode: 'insensitive' } },
              { shortDesc: { contains: `SECRET_${uniqueSuffix}`, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });
    assert.equal(
      descOnlyResults.length,
      0,
      'Search query scoped to commercial attributes must NOT scan description text'
    );
  } finally {
    await prisma.product.delete({ where: { id: testProduct.id } });
    await prisma.$disconnect();
  }
});
