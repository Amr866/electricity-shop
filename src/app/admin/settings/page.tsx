import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminSettingsClient } from "./AdminSettingsClient";

export default async function AdminSettingsPage() {
  const settingsList = await prisma.storeSetting.findMany();
  const settingsMap: Record<string, string> = {};

  settingsList.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return <AdminSettingsClient initialSettings={settingsMap} />;
}
