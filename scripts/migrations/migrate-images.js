const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Starting media assets migration to /public/uploads/products/...');

  const rootImagesDir = path.join(process.cwd(), 'Images');
  const publicLegacyDir = path.join(process.cwd(), 'public', 'images', 'products');
  const targetUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');

  // 1. Ensure target directory exists
  if (!fs.existsSync(targetUploadsDir)) {
    fs.mkdirSync(targetUploadsDir, { recursive: true });
    console.log(`📁 Created target directory: ${targetUploadsDir}`);
  }

  // Helper to copy directory files
  let copiedCount = 0;
  function copyFilesFrom(sourceDir) {
    if (!fs.existsSync(sourceDir)) return;
    const items = fs.readdirSync(sourceDir);
    for (const item of items) {
      const srcPath = path.join(sourceDir, item);
      const stat = fs.statSync(srcPath);
      if (stat.isFile()) {
        const destPath = path.join(targetUploadsDir, item);
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
      }
    }
  }

  // 2. Copy from public/images/products and root Images/
  copyFilesFrom(publicLegacyDir);
  copyFilesFrom(rootImagesDir);
  console.log(`✅ Copied/consolidated ${copiedCount} files to ${targetUploadsDir}`);

  // 3. Update Database records
  console.log('🔄 Updating database image URLs...');
  const productImages = await prisma.productImage.findMany();
  let updatedImages = 0;
  for (const img of productImages) {
    if (img.url.startsWith('/images/products/')) {
      const newUrl = img.url.replace('/images/products/', '/uploads/products/');
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: newUrl }
      });
      updatedImages++;
    }
  }
  console.log(`✅ Updated ${updatedImages} ProductImage records in database.`);

  const categories = await prisma.category.findMany();
  let updatedCategories = 0;
  for (const cat of categories) {
    if (cat.image && cat.image.startsWith('/images/products/')) {
      const newUrl = cat.image.replace('/images/products/', '/uploads/products/');
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: newUrl }
      });
      updatedCategories++;
    }
  }
  console.log(`✅ Updated ${updatedCategories} Category records in database.`);

  // 4. Update seed files to use /uploads/products/
  const seedFiles = [
    path.join(process.cwd(), 'prisma', 'seed_perfect.js'),
    path.join(process.cwd(), 'scripts', 'fix-db-images.js')
  ];
  for (const file of seedFiles) {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('/images/products/')) {
        content = content.replaceAll('/images/products/', '/uploads/products/');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Updated seed/script file: ${path.basename(file)}`);
      }
    }
  }

  // 5. Clean up redundant source directory public/images/products if target has files
  const targetFiles = fs.readdirSync(targetUploadsDir);
  if (targetFiles.length > 20) {
    if (fs.existsSync(publicLegacyDir)) {
      fs.rmSync(publicLegacyDir, { recursive: true, force: true });
      console.log(`🧹 Removed redundant legacy directory: ${publicLegacyDir}`);
    }
    if (fs.existsSync(rootImagesDir)) {
      fs.rmSync(rootImagesDir, { recursive: true, force: true });
      console.log(`🧹 Removed redundant root directory: ${rootImagesDir}`);
    }
  }

  console.log(`🎉 Migration complete! Single source of truth is /public/uploads/products/ (${targetFiles.length} images)`);
}

main()
  .catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
