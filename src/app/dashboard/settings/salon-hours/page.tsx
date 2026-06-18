import Link from "next/link";
import { getSalonWorkingHours } from "@/features/settings/queries";
import SalonHoursTable from "./salon-hours-table";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsSalonHoursPage() {
  await requireAdminForSettings();

  const [hours, salonSettings] = await Promise.all([
    getSalonWorkingHours(),
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
                {t("salonHoursSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("salonHoursSettings.description")}
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
          {hours.length === 0 ? (
            <EmptyStateCard
              title={t("salonHoursSettings.emptyTitle")}
              description={t("salonHoursSettings.emptyDescription")}
            />
          ) : (
            <SalonHoursTable
              hours={hours}
              labels={{
                editHint: t("salonHoursSettings.editHint"),
                saveChangesText: t("salonHoursSettings.saveChangesText"),
                reset: t("salonHoursSettings.reset"),
                saving: t("common.saving"),
                saveChanges: t("salonHoursSettings.saveChanges"),
                day: t("salonHoursSettings.table.day"),
                closed: t("salonHoursSettings.table.closed"),
                opens: t("salonHoursSettings.table.opens"),
                closes: t("salonHoursSettings.table.closes"),
                open: t("salonHoursSettings.open"),
                monday: t("weekdays.monday"),
                tuesday: t("weekdays.tuesday"),
                wednesday: t("weekdays.wednesday"),
                thursday: t("weekdays.thursday"),
                friday: t("weekdays.friday"),
                saturday: t("weekdays.saturday"),
                sunday: t("weekdays.sunday"),
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
