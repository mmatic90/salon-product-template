import { requireDashboardUser } from "@/lib/page-guards";
import { createClient } from "@/lib/supabase/server";
import PageShell from "@/components/page-shell";
import PageHeader from "@/components/page-header";
import PageSection from "@/components/page-section";
import AccountProfileForm from "./account-profile-form";
import ChangePasswordForm from "./change-password-form";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function AccountPage() {
  const permissions = await requireDashboardUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", permissions.userId)
    .single();

  const { data: employee } = await supabase
    .from("employees")
    .select("display_name, color_hex")
    .eq("profile_id", permissions.userId)
    .maybeSingle();

  const salonSettings = await getSalonSettings();
  const t = getTranslator(salonSettings?.language);

  const displayName =
    employee?.display_name || profile?.display_name || permissions.displayName;

  const email = profile?.email || permissions.email || "";

  return (
    <PageShell maxWidth="max-w-5xl">
      <PageHeader
        title={t("account.title")}
        description={t("account.description")}
      />

      <PageSection
        title={t("account.basicInfo")}
        description={`${t("account.loginEmail")}: ${email}`}
      >
        <AccountProfileForm
          initialDisplayName={displayName}
          initialColorHex={employee?.color_hex ?? permissions.colorHex}
          canEditColor={permissions.isEmployee}
          labels={{
            displayName: t("account.displayName"),
            employeeColor: t("account.employeeColor"),
            colorUnavailable: t("account.colorUnavailable"),
            saving: t("common.saving"),
            saveChanges: t("account.saveChanges"),
          }}
        />
      </PageSection>

      <PageSection
        title={t("account.changePassword")}
        description={t("account.changePasswordDescription")}
      >
        <ChangePasswordForm
          email={email}
          labels={{
            oldPassword: t("account.oldPassword"),
            newPassword: t("account.newPassword"),
            repeatNewPassword: t("account.repeatNewPassword"),
            saving: t("common.saving"),
            changePassword: t("account.changePasswordButton"),
            fillAllFields: t("account.fillAllPasswordFields"),
            passwordMinLength: t("account.passwordMinLength"),
            passwordsDoNotMatch: t("account.passwordsDoNotMatch"),
            oldPasswordWrong: t("account.oldPasswordWrong"),
            passwordChanged: t("account.passwordChanged"),
          }}
        />
      </PageSection>
    </PageShell>
  );
}
