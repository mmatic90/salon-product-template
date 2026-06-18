import Link from "next/link";
import { getServiceEquipmentMappingData } from "@/features/settings/queries";
import ServiceEquipmentTable from "./service-equipment-table";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsServiceEquipmentPage() {
  await requireAdminForSettings();

  const [mappingData, salonSettings] = await Promise.all([
    getServiceEquipmentMappingData(),
    getSalonSettings(),
  ]);

  const { services, equipment, mappings } = mappingData;
  const t = getTranslator(salonSettings?.language);

  const activeServices = services.filter((item) => item.is_active);
  const activeEquipment = equipment.filter((item) => item.is_active);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("serviceEquipmentSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("serviceEquipmentSettings.description")}
              </p>
            </div>

            <Link
              href="/dashboard/settings"
              className="rounded-xl border border-app-soft bg-white px-4 py-2 font-medium text-app-text transition hover:bg-app-bg"
            >
              {t("common.back")}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          {activeServices.length === 0 || activeEquipment.length === 0 ? (
            <EmptyStateCard
              title={t("serviceEquipmentSettings.emptyTitle")}
              description={t("serviceEquipmentSettings.emptyDescription")}
            />
          ) : (
            <ServiceEquipmentTable
              services={services}
              equipment={equipment}
              mappings={mappings}
              labels={{
                editHint: t("serviceEquipmentSettings.editHint"),
                saveChangesText: t("serviceEquipmentSettings.saveChangesText"),
                reset: t("serviceEquipmentSettings.reset"),
                saving: t("common.saving"),
                saveChanges: t("serviceEquipmentSettings.saveChanges"),
                service: t("serviceEquipmentSettings.table.service"),
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
