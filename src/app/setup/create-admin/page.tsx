import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import CreateAdminForm from "./create-admin-form";

export default async function CreateInitialAdminPage() {
  const admin = createAdminClient();

  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if ((count ?? 0) > 0) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold">Kreiraj prvi admin račun</h1>

        <p className="mt-2 text-neutral-600">
          Ovo se koristi samo kod prvog postavljanja novog salona.
        </p>

        <div className="mt-8">
          <CreateAdminForm />
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500">
          Već imaš račun?{" "}
          <Link href="/login" className="font-semibold text-neutral-900">
            Prijavi se
          </Link>
        </div>
      </div>
    </main>
  );
}
