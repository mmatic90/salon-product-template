"use client";

import { useActionState } from "react";
import {
  type SalonSettingsActionState,
  updateSalonSettingsAction,
} from "@/features/salon-settings/actions";
import type { SalonSettings } from "@/features/salon-settings/queries";

const initialState: SalonSettingsActionState = {
  error: "",
  success: "",
};

type Labels = {
  salonName: string;
  smsSignature: string;
  phone: string;
  email: string;
  address: string;
  websiteUrl: string;
  logoUrl: string;
  faviconUrl: string;
  appColors: string;
  appColorsDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  mutedColor: string;
  cardColor: string;
  cardAltColor: string;
  borderColor: string;
  timezone: string;
  language: string;
  saving: string;
  save: string;
};

export default function SalonProfileForm({
  settings,
  labels,
}: {
  settings: SalonSettings | null;
  labels: Labels;
}) {
  const [state, formAction, isPending] = useActionState(
    updateSalonSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.success}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.salonName} *
          </span>
          <input
            name="salon_name"
            defaultValue={settings?.salon_name ?? ""}
            required
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="Body & Soul"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.smsSignature} *
          </span>
          <input
            name="sms_signature"
            defaultValue={settings?.sms_signature ?? ""}
            required
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="Body & Soul"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.phone}
          </span>
          <input
            name="public_phone"
            defaultValue={settings?.public_phone ?? ""}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="+385..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.email}
          </span>
          <input
            name="public_email"
            type="email"
            defaultValue={settings?.public_email ?? ""}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="info@salon.hr"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-app-text">
            {labels.address}
          </span>
          <input
            name="address"
            defaultValue={settings?.address ?? ""}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="Ulica 1, Grad"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.websiteUrl}
          </span>
          <input
            name="website_url"
            defaultValue={settings?.website_url ?? ""}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.logoUrl}
          </span>
          <input
            name="logo_url"
            defaultValue={settings?.logo_url ?? ""}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.faviconUrl}
          </span>
          <input
            name="favicon_url"
            defaultValue={settings?.favicon_url ?? ""}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
            placeholder="https://..."
          />
        </label>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-app-text">
            {labels.appColors}
          </h3>
          <p className="mt-1 text-sm text-app-muted">
            {labels.appColorsDescription}
          </p>
        </div>

        {[
          [
            "primary_color",
            labels.primaryColor,
            settings?.primary_color ?? "#776B5D",
          ],
          [
            "secondary_color",
            labels.secondaryColor,
            settings?.secondary_color ?? "#EBE3D5",
          ],
          [
            "accent_color",
            labels.accentColor,
            settings?.accent_color ?? "#776B5D",
          ],
          [
            "background_color",
            labels.backgroundColor,
            settings?.background_color ?? "#F3EEEA",
          ],
          ["text_color", labels.textColor, settings?.text_color ?? "#2B2A28"],
          [
            "muted_color",
            labels.mutedColor,
            settings?.muted_color ?? "#5A5753",
          ],
          ["card_color", labels.cardColor, settings?.card_color ?? "#EBE3D5"],
          [
            "card_alt_color",
            labels.cardAltColor,
            settings?.card_alt_color ?? "#F7F2EC",
          ],
          [
            "border_color",
            labels.borderColor,
            settings?.border_color ?? "#B0A695",
          ],
        ].map(([name, label, value]) => (
          <label key={name} className="space-y-2">
            <span className="text-sm font-medium text-app-text">{label}</span>
            <input
              name={name}
              type="color"
              defaultValue={value}
              className="h-11 w-full rounded-xl border border-app-soft bg-white px-2 py-1"
            />
          </label>
        ))}

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.timezone}
          </span>
          <input
            name="timezone"
            defaultValue={settings?.timezone ?? "Europe/Zagreb"}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-app-text">
            {labels.language}
          </span>
          <select
            name="language"
            defaultValue={settings?.language ?? "hr"}
            className="w-full rounded-xl border border-app-soft bg-white px-4 py-2 text-app-text"
          >
            <option value="hr">Hrvatski</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-app-accent px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? labels.saving : labels.save}
      </button>
    </form>
  );
}
