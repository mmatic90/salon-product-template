import Link from "next/link";
import { getServiceGroupLimitsData } from "@/features/settings/queries";
import GroupLimitsTable from "./group-limits-table";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsGroupLimitsPage() {
  await requireAdminForSettings();

  const [groupLimitsData, salonSettings] = await Promise.all([
    getServiceGroupLimitsData(),
    getSalonSettings(),
  ]);

  const { groups, limits } = groupLimitsData;
  const t = getTranslator(salonSettings?.language);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("groupLimitsSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("groupLimitsSettings.description")}
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
          {groups.length === 0 ? (
            <EmptyStateCard
              title={t("groupLimitsSettings.emptyTitle")}
              description={t("groupLimitsSettings.emptyDescription")}
            />
          ) : (
            <GroupLimitsTable
              groups={groups}
              limits={limits}
              labels={{
                editHint: t("groupLimitsSettings.editHint"),
                saveChangesText: t("groupLimitsSettings.saveChangesText"),
                reset: t("groupLimitsSettings.reset"),
                saving: t("common.saving"),
                saveChanges: t("groupLimitsSettings.saveChanges"),
                group: t("groupLimitsSettings.table.group"),
                maxParallel: t("groupLimitsSettings.table.maxParallel"),
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
