"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createEmployeeAction,
  type EmployeeActionState,
} from "@/features/settings/actions";

const initialState: EmployeeActionState = {
  error: "",
  success: "",
  values: {
    display_name: "",
    email: "",
    phone: "",
    color_hex: "",
    password: "",
  },
};

type Labels = {
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  color: string;
  colorDescription: string;
  accountInfo: string;
  defaultPassword: string;
  adding: string;
  addEmployee: string;
};

export default function EmployeeCreateForm({ labels }: { labels: Labels }) {
  const [state, formAction, pending] = useActionState(
    createEmployeeAction,
    initialState,
  );

  const router = useRouter();

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
    <form action={formAction} className="space-y-4">
      <input
        name="display_name"
        placeholder={labels.namePlaceholder}
        defaultValue={state.values.display_name}
        className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
        required
      />

      <input
        name="email"
        type="email"
        placeholder={labels.emailPlaceholder}
        defaultValue={state.values.email}
        className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
        required
      />

      <input
        name="phone"
        placeholder={labels.phonePlaceholder}
        defaultValue={state.values.phone}
        className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-app-text">
          {labels.color}
        </label>

        <div className="flex items-center gap-3">
          <input
            name="color_hex"
            type="color"
            defaultValue={state.values.color_hex || "#C084FC"}
            className="h-12 w-16 cursor-pointer rounded-lg border border-app-soft bg-white p-1"
          />

          <span className="text-sm text-app-muted">
            {labels.colorDescription}
          </span>
        </div>
      </div>

      <p className="text-sm text-app-muted">
        {labels.accountInfo}{" "}
        <span className="font-medium text-app-text">
          {labels.defaultPassword}
        </span>
        .
      </p>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-app-accent px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? labels.adding : labels.addEmployee}
        </button>
      </div>
    </form>
  );
}
