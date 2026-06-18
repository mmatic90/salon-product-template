"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type SetupActionState = {
  error: string;
};

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function completeInitialSetupAction(
  _prevState: SetupActionState,
  formData: FormData,
): Promise<SetupActionState> {
  const salonName = text(formData.get("salon_name"));
  const email = text(formData.get("admin_email")).toLowerCase();

  if (!salonName) {
    return { error: "Naziv salona je obavezan." };
  }

  if (!email) {
    return { error: "Admin email je obavezan." };
  }

  const admin = createAdminClient();

  const { data: profile, error: profileLookupError } = await admin
    .from("profiles")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (profileLookupError) {
    return { error: profileLookupError.message };
  }

  if (!profile) {
    return {
      error:
        "Admin profil s tim emailom ne postoji. Prvo kreiraj admin račun na /setup/create-admin.",
    };
  }

  const userId = profile.id;

  const { data: existingSettings, error: settingsFetchError } = await admin
    .from("salon_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (settingsFetchError) {
    return { error: settingsFetchError.message };
  }

  const settingsPayload = {
    salon_name: salonName,
    public_email: email,
    sms_signature: salonName,
    primary_color: "#111827",
    timezone: "Europe/Zagreb",
    language: "hr",
    updated_at: new Date().toISOString(),
  };

  if (existingSettings) {
    const { error } = await admin
      .from("salon_settings")
      .update(settingsPayload)
      .eq("id", existingSettings.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await admin
      .from("salon_settings")
      .insert(settingsPayload);

    if (error) {
      return { error: error.message };
    }
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    email,
    role: "admin",
    display_name: "Admin",
    is_active: true,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return { error: profileError.message };
  }

  const { data: existingEmployee, error: employeeFetchError } = await admin
    .from("employees")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (employeeFetchError) {
    return { error: employeeFetchError.message };
  }

  if (existingEmployee) {
    const { error } = await admin
      .from("employees")
      .update({
        display_name: "Admin",
        color_hex: "#2563eb",
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingEmployee.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await admin.from("employees").insert({
      profile_id: userId,
      display_name: "Admin",
      color_hex: "#2563eb",
      is_active: true,
    });

    if (error) {
      return { error: error.message };
    }
  }

  redirect("/dashboard");
}
