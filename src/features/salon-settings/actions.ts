"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SalonSettingsActionState = {
  error: string;
  success: string;
};

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableText(value: FormDataEntryValue | null) {
  const text = normalizeText(value);
  return text.length > 0 ? text : null;
}

export async function updateSalonSettingsAction(
  _prevState: SalonSettingsActionState,
  formData: FormData,
): Promise<SalonSettingsActionState> {
  const supabase = await createClient();

  const salonName = normalizeText(formData.get("salon_name"));
  const publicPhone = normalizeNullableText(formData.get("public_phone"));
  const publicEmail = normalizeNullableText(formData.get("public_email"));
  const address = normalizeNullableText(formData.get("address"));
  const websiteUrl = normalizeNullableText(formData.get("website_url"));
  const logoUrl = normalizeNullableText(formData.get("logo_url"));
  const primaryColor =
    normalizeText(formData.get("primary_color")) || "#111827";
  const smsSignature = normalizeText(formData.get("sms_signature"));
  const timezone = normalizeText(formData.get("timezone")) || "Europe/Zagreb";
  const language = normalizeText(formData.get("language")) || "hr";

  if (!salonName) {
    return {
      error: "Naziv salona je obavezan.",
      success: "",
    };
  }

  if (!smsSignature) {
    return {
      error: "SMS potpis je obavezan.",
      success: "",
    };
  }

  const { data: existingSettings, error: fetchError } = await supabase
    .from("salon_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return {
      error: fetchError.message,
      success: "",
    };
  }

  const payload = {
    salon_name: salonName,
    public_phone: publicPhone,
    public_email: publicEmail,
    address,
    website_url: websiteUrl,
    logo_url: logoUrl,
    primary_color: primaryColor,
    sms_signature: smsSignature,
    timezone,
    language,
    updated_at: new Date().toISOString(),
  };

  if (!existingSettings) {
    const { error } = await supabase.from("salon_settings").insert(payload);

    if (error) {
      return {
        error: error.message,
        success: "",
      };
    }
  } else {
    const { error } = await supabase
      .from("salon_settings")
      .update(payload)
      .eq("id", existingSettings.id);

    if (error) {
      return {
        error: error.message,
        success: "",
      };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/settings/salon-profile");

  return {
    error: "",
    success: "Podaci salona su spremljeni.",
  };
}
