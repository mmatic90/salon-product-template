import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SetupForm from "./setup-form";

export default async function SetupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold">Prvo postavljanje salona</h1>
        <p className="mt-2 text-neutral-600">
          Unesi osnovne podatke kako bi sustav bio spreman za korištenje.
        </p>

        <div className="mt-8">
          <SetupForm userEmail={user.email ?? ""} />
        </div>
      </div>
    </main>
  );
}
