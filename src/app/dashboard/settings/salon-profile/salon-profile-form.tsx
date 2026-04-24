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

export default function SalonProfileForm({
  settings,
}: {
  settings: SalonSettings | null;
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
          <span className="text-sm font-medium">Naziv salona *</span>
          <input
            name="salon_name"
            defaultValue={settings?.salon_name ?? ""}
            required
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="Body & Soul"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">SMS potpis *</span>
          <input
            name="sms_signature"
            defaultValue={settings?.sms_signature ?? ""}
            required
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="Body & Soul"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Telefon</span>
          <input
            name="public_phone"
            defaultValue={settings?.public_phone ?? ""}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="+385..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Email</span>
          <input
            name="public_email"
            type="email"
            defaultValue={settings?.public_email ?? ""}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="info@salon.hr"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">Adresa</span>
          <input
            name="address"
            defaultValue={settings?.address ?? ""}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="Ulica 1, Grad"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Web stranica</span>
          <input
            name="website_url"
            defaultValue={settings?.website_url ?? ""}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Logo URL</span>
          <input
            name="logo_url"
            defaultValue={settings?.logo_url ?? ""}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Primarna boja</span>
          <input
            name="primary_color"
            type="color"
            defaultValue={settings?.primary_color ?? "#111827"}
            className="h-11 w-full rounded-xl border border-neutral-300 px-2 py-1"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Vremenska zona</span>
          <input
            name="timezone"
            defaultValue={settings?.timezone ?? "Europe/Zagreb"}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Jezik</span>
          <select
            name="language"
            defaultValue={settings?.language ?? "hr"}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2"
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
        className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Spremanje..." : "Spremi podatke salona"}
      </button>
    </form>
  );
}
