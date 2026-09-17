#!/usr/bin/env node
const { PrismaClient } = require("@prisma/client");
const crypto = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

function normalizePhone(input) {
  if (!input) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let s = String(input).trim();
  for (let i = 0; i < 10; i++) {
    s = s.replace(new RegExp(farsiDigits[i], "g"), String(i));
    s = s.replace(new RegExp(arabicDigits[i], "g"), String(i));
  }
  s = s.replace(/[\s\-()]/g, "");
  if (s.startsWith("+98")) s = "0" + s.slice(3);
  else if (s.startsWith("0098")) s = "0" + s.slice(4);
  else if (s.startsWith("98")) s = "0" + s.slice(2);
  else if (!s.startsWith("0") && s.length === 10) s = "0" + s;
  return s;
}

async function main() {
  const args = process.argv.slice(2);
  let rawPhone = args[0];
  let rawPassword = args[1];
  let name = args[2] || "مدیریت کارگاه و فروشگاه شیاسی";

  if (!rawPhone || !rawPassword) {
    console.log("Usage: node scripts/create-admin.js <phone> <password> [name]");
    console.log("Example: node scripts/create-admin.js 09136260072 MyPass123! \"مهندس شیاسی\"");
    process.exit(1);
  }

  const phone = normalizePhone(rawPhone);
  if (!/^09\d{9}$/.test(phone)) {
    console.error("Error: Invalid Iranian mobile number. Must be 09XXXXXXXXX.");
    process.exit(1);
  }

  if (rawPassword.length < 6) {
    console.error("Error: Password must be at least 6 characters.");
    process.exit(1);
  }

  const hashedPassword = hashPassword(rawPassword);

  console.log(`Configuring ADMIN account for ${phone}...`);

  const user = await prisma.user.upsert({
    where: { phone },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
      name,
    },
    create: {
      phone,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
      name,
      city: "نجف‌آباد",
    },
  });

  console.log(`✅ Admin account successfully created/updated:`);
  console.log(`   ID: ${user.id}`);
  console.log(`   Name: ${user.name}`);
  console.log(`   Phone: ${user.phone}`);
  console.log(`   Role: ${user.role}`);
}

main()
  .catch((err) => {
    console.error("Failed to create admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
