"use client";

import { useActionState } from "react";
import {
  createInitialAdminAction,
  type CreateAdminState,
} from "@/features/setup/create-admin-action";

const initialState: CreateAdminState = {
  error: "",
};

export default function CreateAdminForm() {
  const [state, formAction, isPending] = useActionState(
    createInitialAdminAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium">Naziv salona *</span>
        <input
          name="salon_name"
          required
          placeholder="Beauty Studio"
          className="w-full rounded-xl border border-neutral-300 px-4 py-3"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Admin email *</span>
        <input
          name="email"
          type="email"
          required
          placeholder="admin@salon.com"
          className="w-full rounded-xl border border-neutral-300 px-4 py-3"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Admin lozinka *</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Minimalno 6 znakova"
          className="w-full rounded-xl border border-neutral-300 px-4 py-3"
        />
      </label>

      <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
        Sustav će automatski kreirati admin korisnika, profil, zaposlenika i
        osnovne podatke salona.
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Kreiranje..." : "Kreiraj salon i admin račun"}
      </button>
    </form>
  );
}
