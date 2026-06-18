import Link from "next/link";
import { requireAdminForSettings } from "@/lib/page-guards";
import PageShell from "@/components/page-shell";
import PageHeader from "@/components/page-header";
import PageSection from "@/components/page-section";
import EmptyStateCard from "@/components/empty-state-card";
import { getAuditLogs } from "@/features/audit/queries";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";
import { getLocaleFromLanguage } from "@/lib/utils";

function formatDateTime(value: string, locale: string, timeZone: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function actionLabel(action: string, t: ReturnType<typeof getTranslator>) {
  const key = `auditLog.actions.${action}` as Parameters<typeof t>[0];

  try {
    return t(key);
  } catch {
    return action;
  }
}

function entityLabel(entityType: string, t: ReturnType<typeof getTranslator>) {
  const key = `auditLog.entities.${entityType}` as Parameters<typeof t>[0];

  try {
    return t(key);
  } catch {
    return entityType;
  }
}

export default async function AuditLogPage() {
  await requireAdminForSettings();

  const [logs, salonSettings] = await Promise.all([
    getAuditLogs(300),
    getSalonSettings(),
  ]);

  const t = getTranslator(salonSettings?.language);
  const locale = getLocaleFromLanguage(salonSettings?.language);
  const timeZone = salonSettings?.timezone || "Europe/Zagreb";

  return (
    <PageShell maxWidth="max-w-7xl">
      <PageHeader
        title={t("auditLog.title")}
        description={t("auditLog.description")}
        actions={
          <Link
            href="/dashboard/settings"
            className="inline-flex rounded-xl border border-app-soft bg-white px-4 py-2 text-sm font-medium text-app-text transition hover:bg-app-bg"
          >
            {t("common.back")}
          </Link>
        }
      />

      <PageSection title={t("auditLog.sectionTitle")}>
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          {logs.length === 0 ? (
            <EmptyStateCard
              title={t("auditLog.emptyTitle")}
              description={t("auditLog.emptyDescription")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-app-table-head">
                  <tr className="text-left text-sm text-app-muted">
                    <th className="px-4 py-3 font-semibold">
                      {t("auditLog.table.dateTime")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("auditLog.table.action")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("auditLog.table.user")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("auditLog.table.entity")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-app-soft text-sm transition hover:bg-app-card-alt"
                    >
                      <td className="px-4 py-4 text-app-text">
                        {formatDateTime(log.created_at, locale, timeZone)}
                      </td>

                      <td className="px-4 py-4 text-app-text">
                        {actionLabel(log.action, t)}
                      </td>

                      <td className="px-4 py-4 text-app-text">
                        {log.actor_display_name ||
                          log.actor_email ||
                          t("auditLog.unknown")}
                      </td>

                      <td className="px-4 py-4 text-app-text">
                        {entityLabel(log.entity_type, t)}
                        {log.entity_label ? (
                          <span className="text-app-muted">
                            {" "}
                            · {log.entity_label}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageSection>
    </PageShell>
  );
}
