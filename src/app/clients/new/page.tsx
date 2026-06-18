import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/client-form";
import { createClientAction } from "@/features/clients/actions";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

export default async function NewClientPage() {
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

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <ClientForm
          title={t("clientForm.newTitle")}
          description={t("clientForm.newDescription")}
          action={createClientAction}
          submitLabel={t("clientForm.saveClient")}
          backHref="/dashboard/clients"
          backLabel={t("common.back")}
          labels={{
            fullName: t("clientForm.fullName"),
            phone: t("clientForm.phone"),
            email: t("clientForm.email"),
            note: t("clientForm.note"),
            internalNote: t("clientForm.internalNote"),
            saving: t("common.saving"),
          }}
          initialValues={{
            full_name: "",
            phone: "",
            email: "",
            note: "",
            internal_note: "",
          }}
        />
      </div>
    </main>
  );
}
