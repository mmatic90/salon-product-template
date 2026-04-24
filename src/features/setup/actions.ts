"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Niste prijavljeni." };
  }

  const salonName = text(formData.get("salon_name"));
  const email = user.email ?? "";

  if (!salonName) {
    return { error: "Naziv salona je obavezan." };
  }

  const admin = createAdminClient();

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
    public_email: email || null,
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
    id: user.id,
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
    .eq("profile_id", user.id)
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
      profile_id: user.id,
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
