"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateAdminState = {
  error: string;
};

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createInitialAdminAction(
  _prevState: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  const salonName = text(formData.get("salon_name"));
  const email = text(formData.get("email")).toLowerCase();
  const password = text(formData.get("password"));

  if (!salonName) return { error: "Naziv salona je obavezan." };
  if (!email) return { error: "Email je obavezan." };
  if (password.length < 6) {
    return { error: "Lozinka mora imati barem 6 znakova." };
  }

  const admin = createAdminClient();

  const { count, error: countError } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (countError) return { error: countError.message };

  if ((count ?? 0) > 0) {
    return {
      error: "Početni admin već postoji. Novi korisnici se dodaju iz postavki.",
    };
  }

  const { data: createdUser, error: createUserError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createUserError || !createdUser.user) {
    return {
      error: createUserError?.message ?? "Greška pri kreiranju korisnika.",
    };
  }

  const userId = createdUser.user.id;

  const { error: settingsError } = await admin.from("salon_settings").insert({
    salon_name: salonName,
    public_email: email,
    sms_signature: salonName,
    primary_color: "#111827",
    timezone: "Europe/Zagreb",
    language: "hr",
  });

  if (settingsError) return { error: settingsError.message };

  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    email,
    role: "admin",
    display_name: "Admin",
    is_active: true,
  });

  if (profileError) return { error: profileError.message };

  const { error: employeeError } = await admin.from("employees").insert({
    profile_id: userId,
    display_name: "Admin",
    color_hex: "#2563eb",
    is_active: true,
  });

  if (employeeError) return { error: employeeError.message };

  redirect("/login");
}
