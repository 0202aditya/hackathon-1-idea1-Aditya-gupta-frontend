"use client";

import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/auth/form-message";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";

export function ForgotPasswordForm({ className }: { className?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();

    setPending(true);
    setError(null);
    setSentTo(null);
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      setSentTo(email);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      {error && <FormMessage kind="error">{error}</FormMessage>}
      {sentTo && (
        <FormMessage kind="success">
          If an account exists for {sentTo}, a reset link is on its way. Open it in this browser.
        </FormMessage>
      )}
      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="priya@example.com"
          required
        />
      </label>
      <button type="submit" className={`${primaryClass} disabled:opacity-60`} disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
