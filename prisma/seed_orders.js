const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedOrders() {
  const products = await prisma.product.findMany({ take: 5 });
  if (products.length === 0) return;

  const sampleOrders = [
    {
      orderNumber: "SH-140306-089",
      customerName: "مهندس رضا کریمی",
      customerPhone: "09131112233",
      nationalCode: "1289876543",
      companyName: "صنایع برق و تاسیسات اصفهان",
      address: "اصفهان، شهرک صنعتی اشترجان، خیابان نهم، پلاک ۲۴",
      shippingMethod: "isfahan_express",
      shippingCost: 0,
      paymentMethod: "zarinpal",
      paymentStatus: "PAID",
      orderStatus: "PROCESSING",
      subtotal: 1850000,
      discount: 100000,
      totalAmount: 1750000,
      notes: "لطفاً قبل از ارسال با تحویل‌گیرنده هماهنگ شود.",
      items: [
        {
          productId: products[0].id,
          productName: products[0].name,
          quantity: 2,
          price: 650000,
          total: 1300000,
        },
        {
          productId: products[1].id,
          productName: products[1].name,
          quantity: 1,
          price: 550000,
          total: 550000,
        },
      ],
    },
    {
      orderNumber: "SH-140306-092",
      customerName: "حاج مسعود شریفی",
      customerPhone: "09131112233",
      nationalCode: "1098765432",
      companyName: null,
      address: "نجف‌آباد، خیابان میرداماد، کوچه شهید قاسم‌زاده، پلاک ۱۸",
      shippingMethod: "isfahan_express",
      shippingCost: 0,
      paymentMethod: "cod_isfahan",
      paymentStatus: "PENDING",
      orderStatus: "SHIPPED",
      trackingCode: "TIPAX-987654321",
      subtotal: 4200000,
      discount: 0,
      totalAmount: 4200000,
      notes: "ارسال با پیک اسنپ‌باکس",
      items: [
        {
          productId: products[2].id,
          productName: products[2].name,
          quantity: 1,
          price: 4200000,
          total: 4200000,
        },
      ],
    },
    {
      orderNumber: "SH-140306-105",
      customerName: "علیرضا صالحی",
      customerPhone: "09123456789",
      nationalCode: "0012345678",
      companyName: "کارگاه سیم‌پیچی نوین",
      address: "تهران، میدان امام خمینی، خیابان فردوسی، پاساژ تابان، طبقه اول",
      shippingMethod: "post_pishtaz",
      shippingCost: 75000,
      paymentMethod: "zarinpal",
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      trackingCode: "283749281726354819203948",
      subtotal: 890000,
      discount: 0,
      totalAmount: 965000,
      notes: "ارسال با پست پیشتاز",
      items: [
        {
          productId: products[3].id,
          productName: products[3].name,
          quantity: 2,
          price: 445000,
          total: 890000,
        },
      ],
    },
  ];

  for (const ord of sampleOrders) {
    const existing = await prisma.order.findUnique({
      where: { orderNumber: ord.orderNumber },
    });
    if (!existing) {
      await prisma.order.create({
        data: {
          orderNumber: ord.orderNumber,
          customerName: ord.customerName,
          customerPhone: ord.customerPhone,
          nationalCode: ord.nationalCode,
          companyName: ord.companyName,
          address: ord.address,
          shippingMethod: ord.shippingMethod,
          shippingCost: ord.shippingCost,
          paymentMethod: ord.paymentMethod,
          paymentStatus: ord.paymentStatus,
          orderStatus: ord.orderStatus,
          trackingCode: ord.trackingCode || null,
          subtotal: ord.subtotal,
          discount: ord.discount,
          totalAmount: ord.totalAmount,
          notes: ord.notes,
          items: {
            create: ord.items,
          },
        },
      });
      console.log(`Created sample order: ${ord.orderNumber}`);
    } else {
      console.log(`Order ${ord.orderNumber} already exists.`);
    }
  }
}

seedOrders()
  .then(() => console.log("Seeding sample orders complete."))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
