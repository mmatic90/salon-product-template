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
  const faviconUrl = normalizeNullableText(formData.get("favicon_url"));

  const primaryColor =
    normalizeText(formData.get("primary_color")) || "#776B5D";
  const secondaryColor =
    normalizeText(formData.get("secondary_color")) || "#EBE3D5";
  const accentColor = normalizeText(formData.get("accent_color")) || "#776B5D";
  const backgroundColor =
    normalizeText(formData.get("background_color")) || "#F3EEEA";
  const textColor = normalizeText(formData.get("text_color")) || "#2B2A28";
  const mutedColor = normalizeText(formData.get("muted_color")) || "#5A5753";
  const cardColor = normalizeText(formData.get("card_color")) || "#EBE3D5";
  const cardAltColor =
    normalizeText(formData.get("card_alt_color")) || "#F7F2EC";
  const borderColor = normalizeText(formData.get("border_color")) || "#B0A695";

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
    favicon_url: faviconUrl,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    accent_color: accentColor,
    background_color: backgroundColor,
    text_color: textColor,
    muted_color: mutedColor,
    card_color: cardColor,
    card_alt_color: cardAltColor,
    border_color: borderColor,
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
