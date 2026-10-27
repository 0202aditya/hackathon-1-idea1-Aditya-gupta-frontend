"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const buttonClass =
  "rounded-full border border-mist/40 px-3 py-1.5 text-sm font-medium text-mist hover:bg-white/10 disabled:opacity-60";

function displayName(user: User) {
  const fullName = user.user_metadata?.full_name;
  return typeof fullName === "string" && fullName.trim() ? fullName.trim() : user.email;
}

export function AuthControl({ user }: { user: User | null | undefined }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setSigningOut(false);
    }
  }

  if (user === undefined) {
    return <span aria-hidden className={`${buttonClass} invisible`}>Login</span>;
  }

  if (!user) {
    return (
      <Link href="/login" className={buttonClass}>
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-40 truncate text-sm text-mist/70 sm:inline">
        {displayName(user)}
      </span>
      <button type="button" onClick={signOut} disabled={signingOut} className={buttonClass}>
        {signingOut ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}
