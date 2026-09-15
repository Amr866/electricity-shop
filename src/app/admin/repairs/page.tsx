import React from "react";
import { prisma } from "@/lib/prisma";
import { RepairsAdminClient } from "./RepairsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminRepairsPage() {
  const repairs = await prisma.repairRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <RepairsAdminClient initialRepairs={repairs} />;
}
