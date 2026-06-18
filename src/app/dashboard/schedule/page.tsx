import Link from "next/link";
import { getEmployeesForSchedule } from "@/features/schedule/queries";
import { requireAdminForScheduleManagement } from "@/lib/page-guards";
import PageShell from "@/components/page-shell";
import InfoTooltip from "@/components/info-tooltip";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SchedulePage() {
  await requireAdminForScheduleManagement();

  const employees = await getEmployeesForSchedule();
  const salonSettings = await getSalonSettings();
  const t = getTranslator(salonSettings?.language);

  return (
    <PageShell maxWidth="max-w-5xl">
      <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-app-text">
              {t("schedule.title")}
            </h1>
            <p className="mt-2 text-app-muted">{t("schedule.description")}</p>
          </div>

          <InfoTooltip text="Za svakog djelatnika možeš postaviti standardni tjedni raspored i posebne iznimke poput godišnjeg, bolovanja, slobodnog dana ili posebnog radnog vremena." />
        </div>
      </div>

      <div className="grid gap-4">
        {employees.length === 0 ? (
          <div className="rounded-2xl border border-app-soft bg-app-card p-6 text-app-muted shadow-sm">
            {t("schedule.noEmployees")}
          </div>
        ) : (
          employees.map((employee) => (
            <Link
              key={employee.id}
              href={`/dashboard/schedule/${employee.id}`}
              className="rounded-2xl border border-app-soft bg-app-card p-5 shadow-sm transition hover:bg-app-card-alt hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: employee.color_hex || "#999999",
                    }}
                  />

                  <div>
                    <h2 className="text-lg font-semibold text-app-text">
                      {employee.display_name}
                    </h2>

                    <p className="text-sm text-app-muted">
                      {t("schedule.editDefaultAndOverrides")}{" "}
                    </p>
                  </div>
                </div>

                <span className="rounded-xl bg-app-accent px-4 py-2 text-sm font-medium text-white">
                  {t("schedule.editSchedule")}{" "}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </PageShell>
  );
}
