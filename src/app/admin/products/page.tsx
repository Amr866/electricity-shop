import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductsAdminClient } from "./ProductsAdminClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <ProductsAdminClient
      initialProducts={products}
      categories={categories}
    />
  );
}
