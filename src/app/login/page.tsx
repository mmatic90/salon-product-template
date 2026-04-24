import { createAdminClient } from "@/lib/supabase/admin";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const admin = createAdminClient();

  const { count } = await admin
    .from("profiles")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("role", "admin");

  const allowInitialSetup = (count ?? 0) === 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Prijava u salon sustav</h1>

          <p className="mt-2 text-sm text-neutral-600">
            Prijavite se za pristup administraciji salona.
          </p>
        </div>

        <LoginForm allowInitialSetup={allowInitialSetup} />
      </div>
    </main>
  );
}
