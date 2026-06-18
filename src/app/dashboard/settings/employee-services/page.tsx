import Link from "next/link";
import { getEmployeeServiceMappingData } from "@/features/settings/queries";
import EmployeeServiceTable from "./employee-service-table";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsEmployeeServicesPage() {
  await requireAdminForSettings();

  const [mappingData, salonSettings] = await Promise.all([
    getEmployeeServiceMappingData(),
    getSalonSettings(),
  ]);

  const { employees, services, mappings } = mappingData;
  const t = getTranslator(salonSettings?.language);

  const activeEmployees = employees.filter((item) => item.is_active);
  const activeServices = services.filter((item) => item.is_active);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("employeeServicesSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("employeeServicesSettings.description")}
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
          {activeEmployees.length === 0 || activeServices.length === 0 ? (
            <EmptyStateCard
              title={t("employeeServicesSettings.emptyTitle")}
              description={t("employeeServicesSettings.emptyDescription")}
            />
          ) : (
            <EmployeeServiceTable
              employees={employees}
              services={services}
              mappings={mappings}
              labels={{
                editHint: t("employeeServicesSettings.editHint"),
                saveChangesText: t("employeeServicesSettings.saveChangesText"),
                reset: t("employeeServicesSettings.reset"),
                saving: t("common.saving"),
                saveChanges: t("employeeServicesSettings.saveChanges"),
                employee: t("employeeServicesSettings.table.employee"),
                all: t("employeeServicesSettings.all"),
                none: t("employeeServicesSettings.none"),
                allServices: t("employeeServicesSettings.allServices"),
                removeAll: t("employeeServicesSettings.removeAll"),
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
