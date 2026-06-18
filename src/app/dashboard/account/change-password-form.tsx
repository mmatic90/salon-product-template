"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type Props = {
  email: string;
  labels: {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
    saving: string;
    changePassword: string;
    fillAllFields: string;
    passwordMinLength: string;
    passwordsDoNotMatch: string;
    oldPasswordWrong: string;
    passwordChanged: string;
  };
};

export default function ChangePasswordForm({ email, labels }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!oldPassword || !newPassword || !repeatPassword) {
      toast.error(labels.fillAllFields);
      return;
    }

    if (newPassword.length < 6) {
      toast.error(labels.passwordMinLength);
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error(labels.passwordsDoNotMatch);
      return;
    }

    setPending(true);

    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword,
      });

      if (verifyError) {
        toast.error(labels.oldPasswordWrong);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        toast.error(signOutError.message);
        return;
      }

      toast.success(labels.passwordChanged);
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-app-text">
          {labels.oldPassword}
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          {labels.newPassword}
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          {labels.repeatNewPassword}
        </label>
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="w-full rounded-xl border border-app-soft bg-white px-4 py-3 text-app-text outline-none transition focus:border-app-accent"
          required
        />
      </div>

      <div className="flex justify-end md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-app-accent px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? labels.saving : labels.changePassword}
        </button>
      </div>
    </form>
  );
}
