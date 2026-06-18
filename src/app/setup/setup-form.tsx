"use client";

import { useActionState } from "react";
import {
  completeInitialSetupAction,
  type SetupActionState,
} from "@/features/setup/actions";

const initialState: SetupActionState = {
  error: "",
};

export default function SetupForm() {
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

      <label className="block space-y-2">
        <span className="text-sm font-medium">Admin email *</span>
        <input
          name="admin_email"
          type="email"
          required
          placeholder="admin@email.com"
          className="w-full rounded-xl border border-neutral-300 px-4 py-3"
        />
      </label>

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
