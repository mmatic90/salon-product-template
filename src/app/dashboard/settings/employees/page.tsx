import Link from "next/link";
import { requireAdminForSettings } from "@/lib/page-guards";
import { getEmployees } from "@/features/settings/queries";
import EmployeesTable from "./employees-table";
import EmployeeCreateForm from "./employee-create-form";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsEmployeesPage() {
  await requireAdminForSettings();

  const [employees, salonSettings] = await Promise.all([
    getEmployees(),
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
                {t("employeesSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("employeesSettings.description")}
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
            {t("employeesSettings.newEmployee")}
          </h2>

          <div className="mt-4">
            <EmployeeCreateForm
              labels={{
                namePlaceholder: t("employeesSettings.namePlaceholder"),
                emailPlaceholder: t("employeesSettings.emailPlaceholder"),
                phonePlaceholder: t("employeesSettings.phonePlaceholder"),
                color: t("employeesSettings.color"),
                colorDescription: t("employeesSettings.colorDescription"),
                accountInfo: t("employeesSettings.accountInfo"),
                defaultPassword: t("employeesSettings.defaultPassword"),
                adding: t("employeesSettings.adding"),
                addEmployee: t("employeesSettings.addEmployee"),
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-app-text">
            {t("employeesSettings.employeesList")}
          </h2>

          <div className="mt-4">
            {employees.length === 0 ? (
              <EmptyStateCard
                title={t("employeesSettings.emptyTitle")}
                description={t("employeesSettings.emptyDescription")}
              />
            ) : (
              <EmployeesTable
                employees={employees}
                labels={{
                  editHint: t("employeesSettings.editHint"),
                  saveChangesText: t("employeesSettings.saveChangesText"),
                  reset: t("employeesSettings.reset"),
                  saving: t("common.saving"),
                  saveChanges: t("employeesSettings.saveChanges"),
                  name: t("employeesSettings.table.name"),
                  email: t("employeesSettings.table.email"),
                  phone: t("employeesSettings.table.phone"),
                  color: t("employeesSettings.table.color"),
                  active: t("employeesSettings.table.active"),
                  inactive: t("employeesSettings.inactive"),
                  actions: t("employeesSettings.table.actions"),
                  resetPassword: t("employeesSettings.resetPassword"),
                  deactivate: t("employeesSettings.deactivate"),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
