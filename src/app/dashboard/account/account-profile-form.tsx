"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateAccountProfileAction,
  type AccountActionState,
} from "@/features/account/actions";

type Props = {
  initialDisplayName: string;
  initialColorHex: string | null;
  canEditColor: boolean;
  labels: {
    displayName: string;
    employeeColor: string;
    colorUnavailable: string;
    saving: string;
    saveChanges: string;
  };
};

const initialState: AccountActionState = {
  error: "",
  success: "",
};

export default function AccountProfileForm({
  initialDisplayName,
  initialColorHex,
  canEditColor,
  labels,
}: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateAccountProfileAction,
    initialState,
  );

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }

    if (state.success) {
      toast.success(state.success);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-app-text">
          {labels.displayName}
        </label>
        <input
          name="display_name"
          defaultValue={initialDisplayName}
          className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          {labels.employeeColor}
        </label>
        <input
          name="color_hex"
          type="color"
          defaultValue={initialColorHex || "#999999"}
          disabled={!canEditColor}
          className="h-12 w-full rounded-xl border border-app-soft bg-white px-2 py-2 outline-none disabled:bg-app-card-alt"
        />
      </div>

      <div className="flex items-end">
        {!canEditColor ? (
          <div className="text-sm text-app-muted">
            {labels.colorUnavailable}
          </div>
        ) : null}
      </div>

      <div className="flex justify-end md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-app-accent px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? labels.saving : labels.saveChanges}
        </button>
      </div>
    </form>
  );
}
