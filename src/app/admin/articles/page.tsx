import React from "react";
import { prisma } from "@/lib/prisma";
import { ArticlesAdminClient } from "./ArticlesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ArticlesAdminClient initialArticles={articles} />;
}
