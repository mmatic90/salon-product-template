import Link from "next/link";
import { requireAdminForSettings } from "@/lib/page-guards";
import { getSalonSettings } from "@/features/salon-settings/queries";
import SalonProfileForm from "./salon-profile-form";

export default async function SalonProfileSettingsPage() {
  await requireAdminForSettings();

  const settings = await getSalonSettings();

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Profil salona</h1>
              <p className="mt-2 text-neutral-600">
                Uredi osnovne podatke koji se koriste kroz aplikaciju.
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
          <SalonProfileForm settings={settings} />
        </div>
      </div>
    </main>
  );
}
