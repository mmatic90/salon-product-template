import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServices } from "@/features/settings/queries";
import { createServiceAction } from "@/features/settings/actions";
import ServicesTable from "./services-table";
import ServiceCreateForm from "./service-create-form";
import { requireAdminForSettings } from "@/lib/page-guards";
import EmptyStateCard from "@/components/empty-state-card";

import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function SettingsServicesPage() {
  await requireAdminForSettings();

  const services = await getServices();

  const salonSettings = await getSalonSettings();
  const t = getTranslator(salonSettings?.language);

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Usluge</h1>
              <p className="mt-2 text-neutral-600">
                Dodaj i upravljaj uslugama.
              </p>
            </div>

            <Link
              href="/dashboard/settings"
              className="rounded-xl border border-neutral-300 px-4 py-2 font-medium"
            >
              Natrag
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Nova usluga</h2>
          <div className="mt-4">
            <ServiceCreateForm />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Popis usluga</h2>
          <div className="mt-4">
            {services.length === 0 ? (
              <EmptyStateCard
                title="Nema usluga"
                description="Dodaj prvu uslugu kako bi se pojavila u popisu i mogla koristiti u terminima."
              />
            ) : (
              <ServicesTable
                services={services}
                labels={{
                  editHint: t("servicesSettings.editHint"),
                  saveChangesText: t("servicesSettings.saveChangesText"),
                  reset: t("servicesSettings.reset"),
                  saving: t("common.saving"),
                  saveChanges: t("servicesSettings.saveChanges"),
                  name: t("servicesSettings.table.name"),
                  duration: t("servicesSettings.table.duration"),
                  group: t("servicesSettings.table.group"),
                  priorityRoom: t("servicesSettings.table.priorityRoom"),
                  active: t("servicesSettings.table.active"),
                  inactive: t("servicesSettings.inactive"),
                  actions: t("servicesSettings.table.actions"),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
