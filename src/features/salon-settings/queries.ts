import { createClient } from "@/lib/supabase/server";

export type SalonSettings = {
  id: string;
  salon_name: string;
  public_phone: string | null;
  public_email: string | null;
  address: string | null;
  website_url: string | null;
  logo_url: string | null;
  primary_color: string;
  sms_signature: string;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
};

export async function getSalonSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("salon_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as SalonSettings | null;
}
