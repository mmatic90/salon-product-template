import type { ReactNode } from "react";
import { getSalonSettings } from "@/features/salon-settings/queries";

export default async function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getSalonSettings();

  return (
    <>
      <title>{settings?.salon_name ?? "Salon Admin"}</title>

      {settings?.favicon_url ? (
        <link rel="icon" href={settings.favicon_url} />
      ) : null}

      {children}
    </>
  );
}
