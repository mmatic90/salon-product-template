import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientForm from "@/components/client-form";
import { getClientById } from "@/features/clients/queries";
import { updateClientAction } from "@/features/clients/actions";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";

type Params = Promise<{
  id: string;
}>;

export default async function EditClientPage({ params }: { params: Params }) {
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
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  const boundAction = updateClientAction.bind(null, client.id);

  return (
    <main className="min-h-screen bg-app-bg p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <ClientForm
          title={t("clientForm.editTitle")}
          description={t("clientForm.editDescription")}
          action={boundAction}
          submitLabel={t("clientForm.saveChanges")}
          backHref={`/dashboard/clients/${client.id}`}
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
            full_name: client.full_name,
            phone: client.phone ?? "",
            email: client.email ?? "",
            note: client.note ?? "",
            internal_note: client.internal_note ?? "",
          }}
        />
      </div>
    </main>
  );
}
