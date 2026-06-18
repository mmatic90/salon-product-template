import Link from "next/link";
import { requireAdminForSettings } from "@/lib/page-guards";
import PageShell from "@/components/page-shell";
import PageHeader from "@/components/page-header";
import PageSection from "@/components/page-section";
import InfoTooltip from "@/components/info-tooltip";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

function SettingsCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-app-card-alt hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-app-text">{title}</h2>
        <InfoTooltip text={description} />
      </div>
    </Link>
  );
}

export default async function SettingsPage() {
  await requireAdminForSettings();

  const salonSettings = await getSalonSettings();
  const t = getTranslator(salonSettings?.language);

  return (
    <PageShell maxWidth="max-w-7xl">
      <PageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <PageSection title={t("settings.modules")}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard
            href="/dashboard/settings/salon-profile"
            title={t("settings.salonProfile.title")}
            description={t("settings.salonProfile.description")}
          />

          <SettingsCard
            href="/dashboard/settings/services"
            title={t("settings.services.title")}
            description={t("settings.services.description")}
          />

          <SettingsCard
            href="/dashboard/settings/rooms"
            title={t("settings.rooms.title")}
            description={t("settings.rooms.description")}
          />

          <SettingsCard
            href="/dashboard/settings/equipment"
            title={t("settings.equipment.title")}
            description={t("settings.equipment.description")}
          />

          <SettingsCard
            href="/dashboard/settings/service-rooms"
            title={t("settings.serviceRooms.title")}
            description={t("settings.serviceRooms.description")}
          />

          <SettingsCard
            href="/dashboard/settings/employee-services"
            title={t("settings.employeeServices.title")}
            description={t("settings.employeeServices.description")}
          />

          <SettingsCard
            href="/dashboard/settings/service-equipment"
            title={t("settings.serviceEquipment.title")}
            description={t("settings.serviceEquipment.description")}
          />

          <SettingsCard
            href="/dashboard/settings/salon-hours"
            title={t("settings.salonHours.title")}
            description={t("settings.salonHours.description")}
          />

          <SettingsCard
            href="/dashboard/settings/group-limits"
            title={t("settings.groupLimits.title")}
            description={t("settings.groupLimits.description")}
          />

          <SettingsCard
            href="/dashboard/settings/employees"
            title={t("settings.employees.title")}
            description={t("settings.employees.description")}
          />

          <SettingsCard
            href="/dashboard/settings/audit-log"
            title={t("settings.auditLog.title")}
            description={t("settings.auditLog.description")}
          />
        </div>
      </PageSection>
    </PageShell>
  );
}
