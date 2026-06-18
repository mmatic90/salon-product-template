import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppointmentsByDate } from "@/features/appointments/queries";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";
import {
  formatDateLabel,
  formatTime,
  getTodayLocalDate,
  statusLabel,
  getLocaleFromLanguage,
} from "@/lib/utils";
import DateQueryPicker from "@/components/date-query-picker";
import AppointmentStatusActions from "@/components/appointment-status-actions";
import EmptyStateCard from "@/components/empty-state-card";
import { formatAppointmentServicesLabel } from "@/features/appointments/format-appointment-services";
import AppointmentRowActions from "@/components/appointment-row-actions";

type SearchParams = Promise<{
  date?: string;
}>;

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
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
  const locale = getLocaleFromLanguage(salonSettings?.language);

  const resolvedSearchParams = await searchParams;
  const selectedDate = resolvedSearchParams.date || getTodayLocalDate();

  const appointments = await getAppointmentsByDate(selectedDate);

  return (
    <main className="min-h-screen bg-app-bg p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("appointments.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("appointments.description")}{" "}
                {formatDateLabel(selectedDate, locale)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <DateQueryPicker
                value={selectedDate}
                basePath="/dashboard/appointments"
              />

              <Link
                href={`/dashboard/appointments/new?date=${selectedDate}`}
                className="inline-flex h-[42px] items-center justify-center rounded-xl bg-app-accent px-4 py-2 font-medium text-white transition hover:opacity-90"
              >
                {t("appointments.newAppointment")}
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-app-soft bg-app-card shadow-sm">
          {appointments.length === 0 ? (
            <EmptyStateCard
              title={t("appointments.emptyTitle")}
              description={t("appointments.emptyDescription")}
              action={
                <Link
                  href={`/dashboard/appointments/new?date=${selectedDate}`}
                  className="inline-flex rounded-xl bg-app-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {t("appointments.addNewAppointment")}
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-app-table-head">
                  <tr className="text-left text-sm text-app-muted">
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.time")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.client")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.service")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.employee")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.room")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.status")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.note")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("appointments.table.actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => {
                    const serviceName = formatAppointmentServicesLabel(
                      appointment.appointment_services
                        ?.slice()
                        .sort((a, b) => a.sort_order - b.sort_order),
                    );
                    const serviceGroup =
                      appointment.service?.service_group ?? null;
                    const employeeName =
                      appointment.employee?.display_name ??
                      t("appointments.unknownEmployee");
                    const employeeColor =
                      appointment.employee?.color_hex || "#999999";
                    const roomName =
                      appointment.room?.name ?? t("appointments.unknownRoom");

                    return (
                      <tr
                        key={appointment.id}
                        className="border-t border-app-soft text-sm transition hover:bg-app-card-alt"
                      >
                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-app-text">
                            {formatTime(appointment.start_time)} -{" "}
                            {formatTime(appointment.end_time)}
                          </div>
                          <div className="mt-1 text-app-muted">
                            {appointment.duration_minutes} min
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-app-text">
                            {appointment.client_name}
                          </div>
                          {appointment.client_phone ? (
                            <div className="mt-1 text-app-muted">
                              {appointment.client_phone}
                            </div>
                          ) : null}
                          {appointment.client_email ? (
                            <div className="mt-1 text-app-muted">
                              {appointment.client_email}
                            </div>
                          ) : null}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="font-medium text-app-text">
                            {serviceName}
                          </div>
                          {serviceGroup ? (
                            <div className="mt-1 text-app-muted">
                              {t("appointments.serviceGroup")}: {serviceGroup}
                            </div>
                          ) : null}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-3 w-3 rounded-full"
                              style={{ backgroundColor: employeeColor }}
                            />
                            <span className="font-medium text-app-text">
                              {employeeName}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top text-app-muted">
                          {roomName}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <span className="rounded-full bg-app-bg px-3 py-1 text-xs font-medium text-app-text">
                            {statusLabel(
                              appointment.status,
                              salonSettings?.language,
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-app-muted">
                          {appointment.internal_note ||
                            appointment.client_note ||
                            "-"}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-col gap-2">
                            <AppointmentRowActions
                              appointmentId={appointment.id}
                              appointmentDate={appointment.appointment_date}
                            />

                            <AppointmentStatusActions
                              appointmentId={appointment.id}
                              currentStatus={appointment.status}
                              compact
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
