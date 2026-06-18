import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { getCurrentUserPermissions } from "@/lib/permissions";
import { getSalonSettings } from "@/features/salon-settings/queries";
import ThemeStyle from "@/components/theme-style";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const permissions = await getCurrentUserPermissions();
  const salonSettings = await getSalonSettings();
  const t = getTranslator(salonSettings?.language);

  if (!permissions) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <ThemeStyle settings={salonSettings} />
      <div className="lg:flex">
        <DashboardSidebar
          role={permissions.role}
          displayName={permissions.displayName}
          salonName={salonSettings?.salon_name ?? "Salon"}
          logoUrl={salonSettings?.logo_url ?? null}
          t={{
            dashboard: t("nav.dashboard"),
            appointments: t("nav.appointments"),
            calendar: t("nav.calendar"),
            timeGrid: t("nav.timeGrid"),
            clients: t("nav.clients"),
            account: t("nav.account"),
            schedule: t("nav.schedule"),
            reports: t("nav.reports"),
            settings: t("nav.settings"),
            adminPanel: t("app.adminPanel"),
            mobileAdmin: t("app.mobileAdmin"),
            loggedInAs: t("app.loggedInAs"),
          }}
        />

        <main className="min-w-0 flex-1 transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
