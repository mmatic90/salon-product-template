"use client";

import { useActionState } from "react";
import {
  completeInitialSetupAction,
  type SetupActionState,
} from "@/features/setup/actions";

const initialState: SetupActionState = {
  error: "",
};

export default function SetupForm({ userEmail }: { userEmail: string }) {
  const [state, formAction, isPending] = useActionState(
    completeInitialSetupAction,
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

      <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
        Admin korisnik će automatski biti kreiran kao <strong>Admin</strong>.
        Kasnije možeš promijeniti ime u postavkama.
      </div>

      <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
        Prijavljeni email: <strong>{userEmail}</strong>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Postavljanje..." : "Završi postavljanje"}
      </button>
    </form>
  );
}
