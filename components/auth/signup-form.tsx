"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/auth/form-message";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";

const MIN_PASSWORD_LENGTH = 6;

export function SignupForm({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    setError(null);
    setNotice(null);

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
      const { data, error } = await createClient().auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/wallet`,
        },
      });
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      if (!data.session) {
        // Only reached if "Confirm email" is enabled in Supabase.
        setNotice(`Check ${email} for a confirmation link to finish signing up.`);
        return;
      }
      router.replace("/wallet");
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
      {notice && <FormMessage kind="success">{notice}</FormMessage>}
      <label className="block">
        <span className={labelClass}>Full name</span>
        <input
          className={inputClass}
          name="fullName"
          autoComplete="name"
          placeholder="Your full name"
          required
        />
      </label>
      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          required
        />
      </label>
      <label className="block">
        <span className={labelClass}>Password</span>
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
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
