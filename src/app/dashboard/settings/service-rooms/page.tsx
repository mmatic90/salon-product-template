import Link from "next/link";
import { getServiceRoomMappingData } from "@/features/settings/queries";
import ServiceRoomTable from "./service-room-table";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsServiceRoomsPage() {
  await requireAdminForSettings();

  const [mappingData, salonSettings] = await Promise.all([
    getServiceRoomMappingData(),
    getSalonSettings(),
  ]);

  const { services, rooms, mappings } = mappingData;
  const t = getTranslator(salonSettings?.language);

  const activeServices = services.filter((item) => item.is_active);
  const activeRooms = rooms.filter((item) => item.is_active);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("serviceRoomsSettings.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("serviceRoomsSettings.description")}
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
          {activeServices.length === 0 || activeRooms.length === 0 ? (
            <EmptyStateCard
              title={t("serviceRoomsSettings.emptyTitle")}
              description={t("serviceRoomsSettings.emptyDescription")}
            />
          ) : (
            <ServiceRoomTable
              services={services}
              rooms={rooms}
              mappings={mappings}
              labels={{
                editHint: t("serviceRoomsSettings.editHint"),
                saveChangesText: t("serviceRoomsSettings.saveChangesText"),
                reset: t("serviceRoomsSettings.reset"),
                saving: t("common.saving"),
                saveChanges: t("serviceRoomsSettings.saveChanges"),
                service: t("serviceRoomsSettings.table.service"),
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
