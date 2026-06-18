import { getReportsDashboardData } from "@/features/reports/queries";
import { requireAdminForReports } from "@/lib/page-guards";
import { formatDateHR } from "@/lib/datetime";
import EmptyStateCard from "@/components/empty-state-card";
import PageShell from "@/components/page-shell";
import PageHeader from "@/components/page-header";
import PageSection from "@/components/page-section";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
      <div className="text-sm text-app-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-app-text">{value}</div>
    </div>
  );
}

export default async function ReportsPage() {
  await requireAdminForReports();

  const [data, salonSettings] = await Promise.all([
    getReportsDashboardData(),
    getSalonSettings(),
  ]);

  const t = getTranslator(salonSettings?.language);

  const hasAnyReportData =
    data.summary.today > 0 || data.summary.week > 0 || data.summary.month > 0;

  return (
    <PageShell maxWidth="max-w-7xl">
      <PageHeader
        title={t("reports.title")}
        description={t("reports.description")}
      />

      {!hasAnyReportData ? (
        <EmptyStateCard
          title={t("reports.emptyTitle")}
          description={t("reports.emptyDescription")}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={t("reports.today")} value={data.summary.today} />
        <StatCard label={t("reports.week")} value={data.summary.week} />
        <StatCard label={t("reports.month")} value={data.summary.month} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PageSection title={t("reports.statuses")}>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#d8d0c3] px-4 py-3">
              <div className="text-sm text-app-text">
                {t("reports.statusScheduled")}
              </div>
              <div className="mt-1 text-2xl font-bold text-app-text">
                {data.statusCounts.scheduled}
              </div>
            </div>

            <div className="rounded-xl bg-[#776B5D] px-4 py-3">
              <div className="text-sm text-white/90">
                {t("reports.statusCompleted")}
              </div>
              <div className="mt-1 text-2xl font-bold text-white">
                {data.statusCounts.completed}
              </div>
            </div>

            <div className="rounded-xl bg-[#c9beb2] px-4 py-3">
              <div className="text-sm text-app-text">
                {t("reports.statusCancelled")}
              </div>
              <div className="mt-1 text-2xl font-bold text-app-text">
                {data.statusCounts.cancelled}
              </div>
            </div>

            <div className="rounded-xl bg-[#4B4844] px-4 py-3">
              <div className="text-sm text-white/90">
                {t("reports.statusNoShow")}
              </div>
              <div className="mt-1 text-2xl font-bold text-white">
                {data.statusCounts.no_show}
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection title={t("reports.last7Days")}>
          <div className="mt-4 space-y-3">
            {data.last7Days.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between rounded-xl border border-app-soft bg-white px-4 py-3"
              >
                <div className="text-sm text-app-muted">
                  {formatDateHR(day.date)}
                </div>
                <div className="text-lg font-semibold text-app-text">
                  {day.count}
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PageSection title={t("reports.topEmployees")}>
          <div className="mt-4 space-y-3">
            {data.topEmployees.length > 0 ? (
              data.topEmployees.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-app-soft bg-white px-4 py-3"
                >
                  <div className="text-sm font-medium text-app-text">
                    {item.name}
                  </div>
                  <div className="text-sm text-app-muted">
                    {item.count} {t("reports.appointments")}
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateCard
                title={t("reports.noEmployeesTitle")}
                description={t("reports.noEmployeesDescription")}
              />
            )}
          </div>
        </PageSection>

        <PageSection title={t("reports.topServices")}>
          <div className="mt-4 space-y-3">
            {data.topServices.length > 0 ? (
              data.topServices.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-app-soft bg-white px-4 py-3"
                >
                  <div className="text-sm font-medium text-app-text">
                    {item.name}
                  </div>
                  <div className="text-sm text-app-muted">
                    {item.count} {t("reports.appointments")}
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateCard
                title={t("reports.noServicesTitle")}
                description={t("reports.noServicesDescription")}
              />
            )}
          </div>
        </PageSection>
      </div>
    </PageShell>
  );
}
