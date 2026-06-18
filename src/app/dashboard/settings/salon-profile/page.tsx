import Link from "next/link";
import { requireAdminForSettings } from "@/lib/page-guards";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";
import SalonProfileForm from "./salon-profile-form";

export default async function SalonProfileSettingsPage() {
  await requireAdminForSettings();

  const settings = await getSalonSettings();
  const t = getTranslator(settings?.language);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-text">
                {t("salonProfile.title")}
              </h1>
              <p className="mt-2 text-app-muted">
                {t("salonProfile.description")}
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
          <SalonProfileForm
            settings={settings}
            labels={{
              salonName: t("salonProfile.salonName"),
              smsSignature: t("salonProfile.smsSignature"),
              phone: t("salonProfile.phone"),
              email: t("salonProfile.email"),
              address: t("salonProfile.address"),
              websiteUrl: t("salonProfile.websiteUrl"),
              logoUrl: t("salonProfile.logoUrl"),
              faviconUrl: t("salonProfile.faviconUrl"),
              appColors: t("salonProfile.appColors"),
              appColorsDescription: t("salonProfile.appColorsDescription"),
              primaryColor: t("salonProfile.primaryColor"),
              secondaryColor: t("salonProfile.secondaryColor"),
              accentColor: t("salonProfile.accentColor"),
              backgroundColor: t("salonProfile.backgroundColor"),
              textColor: t("salonProfile.textColor"),
              mutedColor: t("salonProfile.mutedColor"),
              cardColor: t("salonProfile.cardColor"),
              cardAltColor: t("salonProfile.cardAltColor"),
              borderColor: t("salonProfile.borderColor"),
              timezone: t("salonProfile.timezone"),
              language: t("salonProfile.language"),
              saving: t("common.saving"),
              save: t("salonProfile.save"),
            }}
          />
        </div>
      </div>
    </main>
  );
}
