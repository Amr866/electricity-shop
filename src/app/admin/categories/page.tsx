import React from "react";
import { prisma } from "@/lib/prisma";
import { CategoriesAdminClient } from "./CategoriesAdminClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return <CategoriesAdminClient initialCategories={categories} />;
}
