import Link from "next/link";
import { getEquipment } from "@/features/settings/queries";
import EquipmentTable from "./equipment-table";
import EquipmentCreateForm from "./equipment-create-form";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsEquipmentPage() {
  await requireAdminForSettings();

  const [equipment, salonSettings] = await Promise.all([
    getEquipment(),
    getSalonSettings(),
  ]);

  const t = getTranslator(salonSettings?.language);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("equipmentSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("equipmentSettings.description")}
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
          <h2 className="text-xl font-semibold text-app-text">
            {t("equipmentSettings.newEquipment")}
          </h2>

          <div className="mt-4">
            <EquipmentCreateForm
              labels={{
                namePlaceholder: t("equipmentSettings.namePlaceholder"),
                quantityPlaceholder: t("equipmentSettings.quantityPlaceholder"),
                adding: t("equipmentSettings.adding"),
                addEquipment: t("equipmentSettings.addEquipment"),
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-app-text">
            {t("equipmentSettings.equipmentList")}
          </h2>

          <div className="mt-4">
            {equipment.length === 0 ? (
              <EmptyStateCard
                title={t("equipmentSettings.emptyTitle")}
                description={t("equipmentSettings.emptyDescription")}
              />
            ) : (
              <EquipmentTable
                equipment={equipment}
                labels={{
                  editHint: t("equipmentSettings.editHint"),
                  saveChangesText: t("equipmentSettings.saveChangesText"),
                  reset: t("equipmentSettings.reset"),
                  saving: t("common.saving"),
                  saveChanges: t("equipmentSettings.saveChanges"),
                  name: t("equipmentSettings.table.name"),
                  quantity: t("equipmentSettings.table.quantity"),
                  active: t("equipmentSettings.table.active"),
                  inactive: t("equipmentSettings.inactive"),
                  actions: t("equipmentSettings.table.actions"),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
