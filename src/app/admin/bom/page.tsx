import React from "react";
import { prisma } from "@/lib/prisma";
import { BomAdminClient } from "./BomAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminBomPage() {
  const submissions = await prisma.bOMSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <BomAdminClient initialSubmissions={submissions} />;
}
