import Link from "next/link";
import { getRooms } from "@/features/settings/queries";
import RoomsTable from "./rooms-table";
import RoomCreateForm from "./room-create-form";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsRoomsPage() {
  await requireAdminForSettings();

  const [rooms, salonSettings] = await Promise.all([
    getRooms(),
    getSalonSettings(),
  ]);

  const t = getTranslator(salonSettings?.language);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("roomsSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("roomsSettings.description")}
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
            {t("roomsSettings.newRoom")}
          </h2>

          <div className="mt-4">
            <RoomCreateForm
              labels={{
                namePlaceholder: t("roomsSettings.namePlaceholder"),
                adding: t("roomsSettings.adding"),
                addRoom: t("roomsSettings.addRoom"),
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-app-text">
            {t("roomsSettings.roomsList")}
          </h2>

          <div className="mt-4">
            {rooms.length === 0 ? (
              <EmptyStateCard
                title={t("roomsSettings.emptyTitle")}
                description={t("roomsSettings.emptyDescription")}
              />
            ) : (
              <RoomsTable
                rooms={rooms}
                labels={{
                  editHint: t("roomsSettings.editHint"),
                  saveChangesText: t("roomsSettings.saveChangesText"),
                  reset: t("roomsSettings.reset"),
                  saving: t("common.saving"),
                  saveChanges: t("roomsSettings.saveChanges"),
                  name: t("roomsSettings.table.name"),
                  active: t("roomsSettings.table.active"),
                  inactive: t("roomsSettings.inactive"),
                  actions: t("roomsSettings.table.actions"),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
