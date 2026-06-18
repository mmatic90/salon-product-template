"use client";

import { useActionState, useEffect } from "react";
import {
  createRoomAction,
  type SettingsActionState,
} from "@/features/settings/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState: SettingsActionState = {
  error: "",
  success: "",
};

type Labels = {
  namePlaceholder: string;
  adding: string;
  addRoom: string;
};

export default function RoomCreateForm({ labels }: { labels: Labels }) {
  const [state, formAction, pending] = useActionState(
    createRoomAction,
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
        name="name"
        placeholder={labels.namePlaceholder}
        className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
        required
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-app-accent px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? labels.adding : labels.addRoom}
        </button>
      </div>
    </form>
  );
}
