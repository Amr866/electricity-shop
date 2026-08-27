import React from "react";
import { prisma } from "@/lib/prisma";
import { SettingsAdminClient } from "./SettingsAdminClient";

export default async function AdminSettingsPage() {
  const settingsList = await prisma.storeSetting.findMany();
  const settingsMap: Record<string, string> = {};

  settingsList.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return <SettingsAdminClient initialSettings={settingsMap} />;
}
