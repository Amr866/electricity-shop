const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Updating live database product images for water pumps and bearings...');

  // 1. Water pump products -> Real pump image
  const pumpProducts = await prisma.product.findMany({
    where: {
      name: {
        contains: 'پمپ',
      },
    },
  });

  console.log(`Found ${pumpProducts.length} pump products to update.`);
  for (const prod of pumpProducts) {
    // Update ProductImage
    await prisma.productImage.deleteMany({
      where: { productId: prod.id },
    });
    await prisma.productImage.create({
      data: {
        productId: prod.id,
        url: '/images/products/adonyig-machine-3098797_1920.jpg',
        isPrimary: true,
        alt: prod.name,
      },
    });
    console.log(`✅ Updated photo for pump: ${prod.name}`);
  }

  // 2. Bearing and accessory products -> Real bearing equipment image
  const bearingProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'یاتاقان' } },
        { name: { contains: 'شناور' } },
      ],
    },
  });

  console.log(`Found ${bearingProducts.length} bearing/part products to update.`);
  for (const prod of bearingProducts) {
    await prisma.productImage.deleteMany({
      where: { productId: prod.id },
    });
    await prisma.productImage.create({
      data: {
        productId: prod.id,
        url: '/images/products/richard_ssmid-equipment-3111880_1920.jpg',
        isPrimary: true,
        alt: prod.name,
      },
    });
    console.log(`✅ Updated photo for bearing/part: ${prod.name}`);
  }

  // 3. Belts -> Real belt image
  const beltProducts = await prisma.product.findMany({
    where: {
      name: { contains: 'تسمه' },
    },
  });

  for (const prod of beltProducts) {
    await prisma.productImage.deleteMany({
      where: { productId: prod.id },
    });
    await prisma.productImage.create({
      data: {
        productId: prod.id,
        url: '/images/products/republica-wire-732209_1920.jpg',
        isPrimary: true,
        alt: prod.name,
      },
    });
    console.log(`✅ Updated photo for belt: ${prod.name}`);
  }

  console.log('🎉 Live database images updated successfully!');
}

main()
  .catch((e) => {
    console.error('Error updating live database images:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
