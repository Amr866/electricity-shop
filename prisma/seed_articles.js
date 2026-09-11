const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const tsContent = fs.readFileSync('./src/data/articles.ts', 'utf8');

  // Parse INITIAL_ARTICLES array items by regex or structure
  // Or write the 3 articles directly with their full text
  const articles = [
    {
      slug: "modern-ceiling-lights-guide",
      title: "راهنمای جامع انتخاب و خرید چراغ سقفی ارزان و مدرن برای منازل و دفاتر",
      category: "نورپردازی و روشنایی",
      readTime: "۶ دقیقه مطالعه",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
      authorName: "کارشناس فنی فروشگاه شیاسی",
      summary: "بررسی تفاوت پنل‌های SMD و چراغ‌های COB، مقایسه چراغ‌های توکار و روکار، محاسبه لومن بر اساس متراژ و آموزش نکات کلیدی برای کاهش مصرف برق و افزایش طول عمر روشنایی ساختمان.",
      tags: "روشنایی_مدرن, چراغ_سقفی, پنل_SMD, پنل_COB, نورپردازی_منزل, برق_ساختمان, کاهش_مصرف_برق, پنل_توکار, نور_طبیعی",
    },
    {
      slug: "hidden-lighting-places",
      title: "بهترین مکان‌ها برای اجرای نور مخفی و لاین نوری در خانه و نمای ساختمان",
      category: "طراحی لاین نوری",
      readTime: "۷ دقیقه مطالعه",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      authorName: "کارشناس فنی فروشگاه شیاسی",
      summary: "آشنایی با ۸ موقعیت طلایی اجرای لاین نوری در کناف سقف، قرنیز، زیر کابینت، پله‌ها، تی‌وی‌وال، سرویس بهداشتی و نما، به همراه بررسی ترانس ۱۲ ولت، دیفیوزر و جلوگیری از افت ولتاژ.",
      tags: "لاین_نوری, نور_مخفی, پروفیل_نور_خطی, طراحی_داخلی, نورپردازی_نما, ال_ای_دی_شاخه_ای, کناف_سقف, ترانس_۱۲_ولت, افت_ولتاژ, دیفیوزر_شیری",
    },
    {
      slug: "cooler-motor-service-guide",
      title: "راهنمای کامل عیب‌یابی، روغن‌کاری و سرویس دوره‌ای الکتروموتور و پمپ کولر آبی",
      category: "سرویس و تعمیرات",
      readTime: "۸ دقیقه مطالعه",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      authorName: "کارشناس فنی فروشگاه شیاسی",
      summary: "راهنمای تخصصی کارگاه سیم‌پیچی شیاسی برای تست خازن راه‌انداز، روغن‌کاری بوش‌ها و نمدی، رفع صدای ناهنجار، تنظیم سفتی تسمه و سرویس پمپ آب موتوژن و الکتروژن.",
      tags: "موتور_کولر, پمپ_کولر_آبی, موتوژن, الکتروژن, الکتروموتور, تعمیرات_برقی, سرویس_کولر, روغن_کاری_کولر, خازن_راه_انداز, کارگاه_شیاسی, سیم_پیچی",
    }
  ];

  // Extract content strings from ts file
  const contents = [];
  const regex = /content:\s*`([\s\S]*?)`\s*}/g;
  let match;
  while ((match = regex.exec(tsContent)) !== null) {
    contents.push(match[1].trim());
  }

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    const fullContent = contents[i] || art.summary;
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        category: art.category,
        readTime: art.readTime,
        image: art.image,
        authorName: art.authorName,
        summary: art.summary,
        content: fullContent,
        tags: art.tags,
        isPublished: true,
      },
      create: {
        title: art.title,
        slug: art.slug,
        category: art.category,
        readTime: art.readTime,
        image: art.image,
        authorName: art.authorName,
        summary: art.summary,
        content: fullContent,
        tags: art.tags,
        isPublished: true,
      },
    });
    console.log(`Upserted article: ${art.slug} (${fullContent.length} chars)`);
  }
}

main()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
