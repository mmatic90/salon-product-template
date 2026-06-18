import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClientsList } from "@/features/clients/queries";
import { deleteClientAction } from "@/features/clients/actions";
import { getSalonSettings } from "@/features/salon-settings/queries";
import { getTranslator } from "@/lib/i18n/get-translator";
import EmptyStateCard from "@/components/empty-state-card";
import PageShell from "@/components/page-shell";
import PageHeader from "@/components/page-header";
import PageSection from "@/components/page-section";
import SettingsDeleteButton from "@/components/settings-delete-button";

type SearchParams = Promise<{
  q?: string;
}>;

function formatDate(value: string | null, locale: string) {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function ClientsPage({
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
  const locale =
    salonSettings?.language === "en"
      ? "en-US"
      : salonSettings?.language === "it"
        ? "it-IT"
        : "hr-HR";

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  const clients = await getClientsList(query);

  return (
    <PageShell maxWidth="max-w-7xl">
      <PageHeader
        title={t("clients.title")}
        description={t("clients.description")}
        actions={
          <Link
            href="/dashboard/clients/new"
            className="inline-flex rounded-xl bg-app-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {t("clients.newClient")}
          </Link>
        }
      />

      <PageSection>
        <form action="/dashboard/clients">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder={t("clients.searchPlaceholder")}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none placeholder:text-app-muted"
          />
        </form>
      </PageSection>

      <div className="rounded-2xl border border-app-soft bg-app-card p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-app-table-head">
              <tr className="text-left text-sm text-app-muted">
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.client")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.phone")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.email")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.appointmentsCount")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.lastAppointment")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.nextAppointment")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("clients.table.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-app-soft text-sm transition hover:bg-app-card-alt"
                >
                  <td className="px-4 py-4 font-medium text-app-text">
                    {client.full_name}
                  </td>
                  <td className="px-4 py-4 text-app-muted">
                    {client.phone || "-"}
                  </td>
                  <td className="px-4 py-4 text-app-muted">
                    {client.email || "-"}
                  </td>
                  <td className="px-4 py-4 text-app-text">
                    {client.appointments_count}
                  </td>
                  <td className="px-4 py-4 text-app-muted">
                    {formatDate(client.last_appointment, locale)}
                  </td>
                  <td className="px-4 py-4 text-app-muted">
                    {formatDate(client.next_appointment, locale)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="rounded-xl border border-app-soft bg-white px-3 py-2 text-sm font-medium text-app-text transition hover:bg-app-bg"
                      >
                        {t("common.open")}
                      </Link>

                      <Link
                        href={`/dashboard/clients/${client.id}/edit`}
                        className="rounded-xl border border-app-soft bg-white px-3 py-2 text-sm font-medium text-app-text transition hover:bg-app-bg"
                      >
                        {t("common.edit")}
                      </Link>

                      <SettingsDeleteButton
                        label={client.full_name}
                        onDelete={deleteClientAction.bind(null, client.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clients.length === 0 ? (
          <div className="mt-4">
            <EmptyStateCard
              title={t("clients.emptyTitle")}
              description={t("clients.emptyDescription")}
            />
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
