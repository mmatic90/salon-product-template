import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientById } from "@/features/clients/queries";
import { formatTime, statusLabel } from "@/lib/utils";
import EmptyStateCard from "@/components/empty-state-card";
import { formatAppointmentServicesLabel } from "@/features/appointments/format-appointment-services";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

type Params = Promise<{
  id: string;
}>;

function getLocale(language: string | null | undefined) {
  if (language === "en") return "en-US";
  if (language === "it") return "it-IT";
  return "hr-HR";
}

function formatDate(value: string | null, locale: string) {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function segmentClasses(segment: string) {
  switch (segment) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "active":
      return "border-green-200 bg-green-50 text-green-700";
    case "regular":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "at_risk":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "lost":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-app-soft bg-app-bg text-app-text";
  }
}

function InsightCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
      <div className="text-sm text-app-muted">{label}</div>
      <div className="mt-2 text-lg font-semibold text-app-text">{value}</div>
    </div>
  );
}

export default async function ClientDetailsPage({
  params,
}: {
  params: Params;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const salonSettings = await getSalonSettings();
  const t = getTranslator(salonSettings?.language);
  const locale = getLocale(salonSettings?.language);

  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  const segmentLabels: Record<string, string> = {
    new: t("clientDetails.segment.new"),
    active: t("clientDetails.segment.active"),
    regular: t("clientDetails.segment.regular"),
    at_risk: t("clientDetails.segment.atRisk"),
    lost: t("clientDetails.segment.lost"),
  };

  const segmentLabel =
    segmentLabels[client.insights.segment] ?? client.insights.segment;

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-app-text">
                  {client.full_name}
                </h1>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${segmentClasses(
                    client.insights.segment,
                  )}`}
                >
                  {segmentLabel}
                </span>
              </div>

              <p className="mt-2 text-app-muted">
                {t("clientDetails.description")}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/clients/${client.id}/edit`}
                className="rounded-xl border border-app-soft bg-white px-4 py-2 font-medium text-app-text transition hover:bg-app-bg"
              >
                {t("common.edit")}
              </Link>
              <Link
                href="/dashboard/clients"
                className="rounded-xl border border-app-soft bg-white px-4 py-2 font-medium text-app-text transition hover:bg-app-bg"
              >
                {t("common.back")}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            label={t("clientDetails.phone")}
            value={client.phone || "-"}
          />
          <InsightCard
            label={t("clientDetails.email")}
            value={client.email || "-"}
          />
          <InsightCard
            label={t("clientDetails.appointmentsCount")}
            value={client.appointments_count}
          />
          <InsightCard
            label={t("clientDetails.nextAppointment")}
            value={formatDate(client.next_appointment, locale)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            label={t("clientDetails.completedAppointments")}
            value={client.insights.completed_appointments}
          />
          <InsightCard
            label={t("clientDetails.cancelledAppointments")}
            value={client.insights.cancelled_appointments}
          />
          <InsightCard
            label={t("clientDetails.noShowAppointments")}
            value={client.insights.no_show_appointments}
          />
          <InsightCard
            label={t("clientDetails.lastVisit")}
            value={formatDate(
              client.insights.last_completed_appointment,
              locale,
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            label={t("clientDetails.noShowRate")}
            value={`${client.insights.no_show_rate}%`}
          />
          <InsightCard
            label={t("clientDetails.cancellationRate")}
            value={`${client.insights.cancellation_rate}%`}
          />
          <InsightCard
            label={t("clientDetails.favoriteService")}
            value={client.insights.favorite_service || "-"}
          />
          <InsightCard
            label={t("clientDetails.favoriteEmployee")}
            value={client.insights.favorite_employee || "-"}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-app-text">
              {t("clientDetails.intelligence")}
            </h2>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-app-soft bg-white px-4 py-3 text-sm text-app-text">
                {t("clientDetails.averageDaysBetweenVisits")}:{" "}
                <span className="font-semibold">
                  {client.insights.average_days_between_visits !== null
                    ? `${client.insights.average_days_between_visits} ${t(
                        "clientDetails.days",
                      )}`
                    : "-"}
                </span>
              </div>

              <div className="rounded-xl border border-app-soft bg-white px-4 py-3 text-sm text-app-text">
                {t("clientDetails.clientSegment")}:{" "}
                <span className="font-semibold">{segmentLabel}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-app-text">
              {t("clientDetails.alerts")}
            </h2>

            <div className="mt-4 space-y-3">
              {client.insights.alerts.length > 0 ? (
                client.insights.alerts.map((alert, index) => (
                  <div
                    key={`${alert}-${index}`}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    {alert}
                  </div>
                ))
              ) : (
                <EmptyStateCard
                  title={t("clientDetails.noAlertsTitle")}
                  description={t("clientDetails.noAlertsDescription")}
                />
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-app-text">
              {t("clientDetails.upcomingAppointments")}
            </h2>

            <div className="mt-4 space-y-3">
              {client.upcomingAppointments.length > 0 ? (
                client.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-xl border border-app-soft bg-white px-4 py-3"
                  >
                    <div className="font-medium text-app-text">
                      {formatDate(appointment.appointment_date, locale)} ·{" "}
                      {formatTime(appointment.start_time)} -{" "}
                      {formatTime(appointment.end_time)}
                    </div>
                    <div className="mt-1 text-sm text-app-muted">
                      {formatAppointmentServicesLabel(
                        appointment.appointment_services
                          ?.slice()
                          .sort((a, b) => a.sort_order - b.sort_order),
                      )}{" "}
                      · {appointment.employee?.display_name || "-"} ·{" "}
                      {appointment.room?.name || "-"}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyStateCard
                  title={t("clientDetails.noUpcomingTitle")}
                  description={t("clientDetails.noUpcomingDescription")}
                />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-app-text">
              {t("clientDetails.notes")}
            </h2>

            <div className="mt-4 space-y-3">
              {client.note ? (
                <div className="rounded-xl border border-app-soft bg-white px-4 py-3 text-sm text-app-text">
                  {client.note}
                </div>
              ) : (
                <EmptyStateCard
                  title={t("clientDetails.noNoteTitle")}
                  description={t("clientDetails.noNoteDescription")}
                />
              )}

              {client.internal_note ? (
                <div className="rounded-xl border border-app-soft bg-white px-4 py-3 text-sm text-app-text">
                  {client.internal_note}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-app-text">
            {t("clientDetails.appointmentHistory")}
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-app-table-head">
                <tr className="text-left text-sm text-app-muted">
                  <th className="px-4 py-3 font-semibold">
                    {t("clientDetails.table.date")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("clientDetails.table.time")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("clientDetails.table.service")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("clientDetails.table.employee")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("clientDetails.table.room")}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t("clientDetails.table.status")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {client.pastAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-t border-app-soft text-sm transition hover:bg-app-card-alt"
                  >
                    <td className="px-4 py-4 text-app-text">
                      {formatDate(appointment.appointment_date, locale)}
                    </td>
                    <td className="px-4 py-4 text-app-text">
                      {formatTime(appointment.start_time)} -{" "}
                      {formatTime(appointment.end_time)}
                    </td>
                    <td className="px-4 py-4 text-app-text">
                      {formatAppointmentServicesLabel(
                        appointment.appointment_services
                          ?.slice()
                          .sort((a, b) => a.sort_order - b.sort_order),
                      )}
                    </td>
                    <td className="px-4 py-4 text-app-text">
                      {appointment.employee?.display_name || "-"}
                    </td>
                    <td className="px-4 py-4 text-app-text">
                      {appointment.room?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-app-muted">
                      {statusLabel(appointment.status, salonSettings?.language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {client.pastAppointments.length === 0 ? (
            <div className="mt-4">
              <EmptyStateCard
                title={t("clientDetails.noHistoryTitle")}
                description={t("clientDetails.noHistoryDescription")}
              />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
