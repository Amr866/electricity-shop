import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('Phase 9 Seam 1: uploads/products directory exists and has consolidated images', () => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  assert.ok(fs.existsSync(uploadsDir), 'public/uploads/products must exist');
  const files = fs.readdirSync(uploadsDir);
  assert.ok(files.length > 20, 'public/uploads/products must contain migrated product images');
});

test('Phase 9 Seam 2: Database ProductImage records point to /uploads/products/', async () => {
  const images = await prisma.productImage.findMany();
  assert.ok(images.length > 0, 'Database must have ProductImage records');
  const legacyImages = images.filter(img => img.url.startsWith('/images/products/'));
  assert.equal(legacyImages.length, 0, 'No ProductImage records should point to legacy /images/products/');
  const uploadImages = images.filter(img => img.url.startsWith('/uploads/products/'));
  assert.ok(uploadImages.length > 0, 'ProductImage records must point to /uploads/products/');
});

test('Phase 9 Seam 3: next.config.ts has rewrites for /images/products/:path*', () => {
  const configPath = path.join(process.cwd(), 'next.config.ts');
  const content = fs.readFileSync(configPath, 'utf8');
  assert.ok(content.includes('/images/products/:path*'), 'next.config.ts must rewrite /images/products/:path*');
  assert.ok(content.includes('/uploads/products/:path*'), 'next.config.ts must target /uploads/products/:path*');
});
