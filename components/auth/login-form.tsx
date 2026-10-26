"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/auth/form-message";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/supabase/errors";

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setPending(true);
    setError(null);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) {
        setError(authErrorMessage(error));
        return;
      }
      router.replace("/plan");
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
      <label className="block">
        <span className={labelClass}>Password</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <div className="text-sm">
        <Link href="/forgot-password" className="font-medium text-rust">
          Forgot password?
        </Link>
      </div>
      <button type="submit" className={`${primaryClass} disabled:opacity-60`} disabled={pending}>
        {pending ? "Logging in…" : "Continue"}
      </button>
    </form>
  );
}
