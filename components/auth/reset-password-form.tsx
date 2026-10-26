"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/auth/form-message";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";

const MIN_PASSWORD_LENGTH = 6;

export function ResetPasswordForm({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      await supabase.auth.signOut();
      router.replace("/login?reset=1");
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      <label className="block">
        <span className={labelClass}>New password</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
      </label>
      <label className="block">
        <span className={labelClass}>Confirm password</span>
        <input
          className={inputClass}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
      </label>
      <button type="submit" className={`${primaryClass} disabled:opacity-60`} disabled={pending}>
        {pending ? "Saving…" : "Save and return to login"}
      </button>
    </form>
  );
}
