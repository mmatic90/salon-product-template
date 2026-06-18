import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getAppointmentById,
  getAppointmentFormData,
} from "@/features/appointments/queries";
import EditAppointmentForm from "./edit-appointment-form";
import { getClientOptions } from "@/features/clients/queries";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

type Params = Promise<{
  id: string;
}>;

export default async function EditAppointmentPage({
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

  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  const { services, employees, rooms, serviceRooms, employeeServices } =
    await getAppointmentFormData();

  const clients = await getClientOptions();

  return (
    <main className="min-h-screen bg-app-bg p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("appointmentForm.editTitle")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("appointmentForm.editDescription")}
              </p>
            </div>

            <Link
              href={`/dashboard/appointments?date=${appointment.appointment_date}`}
              className="inline-flex items-center justify-center rounded-xl border border-app-soft bg-white px-4 py-2 font-medium text-app-text transition hover:bg-app-bg"
            >
              {t("appointmentForm.backToAppointments")}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <EditAppointmentForm
            appointment={appointment}
            services={services}
            employees={employees}
            rooms={rooms}
            serviceRooms={serviceRooms}
            employeeServices={employeeServices}
            clients={clients}
            labels={{
              date: t("appointmentForm.date"),
              startTime: t("appointmentForm.startTime"),
              client: t("appointmentForm.client"),
              clientName: t("appointmentForm.clientName"),
              phone: t("appointmentForm.phone"),
              email: t("appointmentForm.email"),
              services: t("appointmentForm.services"),
              primaryGroup: t("appointmentForm.primaryGroup"),
              employee: t("appointmentForm.employee"),
              room: t("appointmentForm.room"),
              firstChooseServices: t("appointmentForm.firstChooseServices"),
              loadingAvailability: t("appointmentForm.loadingAvailability"),
              noAvailableEmployees: t("appointmentForm.noAvailableEmployees"),
              chooseEmployee: t("appointmentForm.chooseEmployee"),
              chooseRoom: t("appointmentForm.chooseRoom"),
              priorityRoom: t("appointmentForm.priorityRoom"),
              noEmployeesWarning: t("appointmentForm.noEmployeesWarning"),
              totalDuration: t("appointmentForm.totalDuration"),
              endsAt: t("appointmentForm.endsAt"),
              status: t("appointmentForm.status"),
              scheduled: t("appointmentForm.statusScheduled"),
              completed: t("appointmentForm.statusCompleted"),
              cancelled: t("appointmentForm.statusCancelled"),
              noShow: t("appointmentForm.statusNoShow"),
              clientNote: t("appointmentForm.clientNote"),
              internalNote: t("appointmentForm.internalNote"),
              saving: t("common.saving"),
              saveChanges: t("appointmentForm.saveChanges"),
              cancelling: t("appointmentForm.cancelling"),
              cancelAppointment: t("appointmentForm.cancelAppointment"),
              cancelError: t("appointmentForm.cancelError"),
              fallbackSelectedEmployee: t(
                "appointmentForm.fallbackSelectedEmployee",
              ),
              fallbackSelectedRoom: t("appointmentForm.fallbackSelectedRoom"),
              employeeAutoChanged: t("appointmentForm.employeeAutoChanged"),
              roomAutoChanged: t("appointmentForm.roomAutoChanged"),
              availabilityFetchError: t(
                "appointmentForm.availabilityFetchError",
              ),
            }}
          />
        </div>
      </div>
    </main>
  );
}
