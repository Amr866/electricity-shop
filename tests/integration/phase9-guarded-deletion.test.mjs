import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test("Comprehensive Guarded Deletion & Archival Integration Suite", async (t) => {
  const { deleteGuardedProduct } = await import("../../src/lib/admin/admin-product-guard.ts");
  const { toggleArchiveBom, purgeBomSubmission } = await import("../../src/lib/admin/admin-bom-guard.ts");
  const { guardRepairDeletion, toggleArchiveRepair } = await import("../../src/lib/admin/admin-repair-guard.ts");

  await t.test("Seam 1: Media Next.js rewrite configuration", () => {
    const nextConfigPath = path.join(process.cwd(), "next.config.ts");
    const content = fs.readFileSync(nextConfigPath, "utf8");
    assert.ok(
      content.includes("/images/products/:path*") && content.includes("/uploads/products/:path*"),
      "next.config.ts must define transparent rewrite mapping /images/products to /uploads/products"
    );
  });

  await t.test("Seam 2: Product order-guard invariants", async () => {
    // 2a. Zero orders -> Hard delete
    const cat = await prisma.category.findFirst();
    assert.ok(cat, "Category must exist in database");

    const zeroOrderProduct = await prisma.product.create({
      data: {
        name: "کابل تست بدون سفارش " + Date.now(),
        slug: "test-cable-no-order-" + Date.now(),
        description: "توضیحات تست",
        price: 150000,
        stock: 50,
        categoryId: cat.id,
      },
    });

    const resZero = await deleteGuardedProduct(zeroOrderProduct.id);
    assert.equal(resZero.action, "DELETED", "Product with 0 orders must be hard deleted");
    const checkZero = await prisma.product.findUnique({ where: { id: zeroOrderProduct.id } });
    assert.equal(checkZero, null, "Deleted product must not exist in DB");

    // 2b. Has orders -> Soft archive
    const orderedProduct = await prisma.product.create({
      data: {
        name: "کابل تست دارای سفارش " + Date.now(),
        slug: "test-cable-has-order-" + Date.now(),
        description: "توضیحات تست ۲",
        price: 250000,
        stock: 30,
        categoryId: cat.id,
      },
    });

    const user = await prisma.user.findFirst();
    assert.ok(user, "User must exist in database");

    const order = await prisma.order.create({
      data: {
        orderNumber: "SH-TEST-" + Date.now(),
        customerName: "تست کننده",
        customerPhone: "09130000000",
        address: "اصفهان",
        shippingMethod: "najafabad_pickup",
        paymentMethod: "cod_isfahan",
        subtotal: 250000,
        totalAmount: 250000,
        items: {
          create: {
            productId: orderedProduct.id,
            productName: orderedProduct.name,
            price: orderedProduct.price,
            quantity: 1,
            total: orderedProduct.price,
          },
        },
      },
    });

    const resOrdered = await deleteGuardedProduct(orderedProduct.id);
    assert.equal(resOrdered.action, "ARCHIVED", "Product with orders must transition to ARCHIVED");
    const checkOrdered = await prisma.product.findUnique({ where: { id: orderedProduct.id } });
    assert.equal(checkOrdered.isArchived, true, "isArchived must be true in DB");
    assert.equal(checkOrdered.stock, 0, "Stock must be set to 0");

    // Clean up test order & product
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.product.delete({ where: { id: orderedProduct.id } });
  });

  await t.test("Seam 3: BOM two-stage archival and disk file purge", async () => {
    const bomsDir = path.join(process.cwd(), "public", "uploads", "boms");
    if (!fs.existsSync(bomsDir)) {
      fs.mkdirSync(bomsDir, { recursive: true });
    }

    const testFile = `integ-bom-${Date.now()}.xlsx`;
    const testFilePath = path.join(bomsDir, testFile);
    fs.writeFileSync(testFilePath, "mock binary spreadsheet");

    const bom = await prisma.bOMSubmission.create({
      data: {
        trackingCode: "BOM-INT-" + Date.now().toString().slice(-6),
        contractorName: "مهندس براتی",
        contractorPhone: "09135554433",
        fileUrl: `/uploads/boms/${testFile}`,
        isArchived: false,
      },
    });

    // Stage 1: Soft Archive
    const arch = await toggleArchiveBom(bom.id, true);
    assert.equal(arch.isArchived, true, "BOM must be archived");
    assert.ok(fs.existsSync(testFilePath), "Disk file must remain intact during soft-archive");

    // Stage 2: Permanent Purge
    const purge = await purgeBomSubmission(bom.id);
    assert.equal(purge.success, true, "Purge must succeed");
    assert.equal(fs.existsSync(testFilePath), false, "File must be removed from disk");
    const checkBom = await prisma.bOMSubmission.findUnique({ where: { id: bom.id } });
    assert.equal(checkBom, null, "Record must be deleted from DB");
  });

  await t.test("Seam 4: Workshop repair safety-lock and archival", async () => {
    // 4a. Active stage safety lock
    const active = await prisma.repairRequest.create({
      data: {
        trackingCode: "REP-INP-" + Date.now().toString().slice(-6),
        customerName: "محمد مرادی",
        customerPhone: "09137778899",
        applianceType: "دریل ستونی صنعتی",
        issueDesc: "لقی شفت و صدا",
        status: "REPAIRING",
        isArchived: false,
      },
    });

    await assert.rejects(
      async () => {
        await guardRepairDeletion(active.id);
      },
      (err) => {
        assert.match(err.message, /در جریان|امکان حذف وجود ندارد/);
        return true;
      },
      "In-progress repair must reject deletion"
    );

    await prisma.repairRequest.delete({ where: { id: active.id } });

    // 4b. Terminal stage archival & purge
    const terminal = await prisma.repairRequest.create({
      data: {
        trackingCode: "REP-TRM-" + Date.now().toString().slice(-6),
        customerName: "سهراب سپهری",
        customerPhone: "09138889900",
        applianceType: "پمپ آب ۱ اسب",
        issueDesc: "تکمیل و آماده تحویل",
        status: "DELIVERED",
        isArchived: false,
      },
    });

    // Archive
    const arch = await guardRepairDeletion(terminal.id);
    assert.equal(arch.archived, true, "Terminal repair must be soft-archived");

    // Purge
    const purge = await guardRepairDeletion(terminal.id);
    assert.equal(purge.hardDeleted, true, "Archived terminal repair must be purged");
    const checkRep = await prisma.repairRequest.findUnique({ where: { id: terminal.id } });
    assert.equal(checkRep, null, "Purged repair must be removed from DB");
  });
});
