import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SearchParamNotice } from "@/components/auth/search-param-notice";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl tracking-tight">Log in</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Log in with your email and password.
      </p>
      <div className="mt-6 empty:hidden">
        <Suspense fallback={null}>
          <SearchParamNotice
            param="reset"
            value="1"
            kind="success"
            message="Password updated. Log in with your new password."
          />
        </Suspense>
      </div>
      <LoginForm className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-5" />
      <p className="mt-4 text-sm text-foreground/70">
        New here?{" "}
        <Link href="/signup" className="font-medium text-rust">
          Create an account
        </Link>
      </p>
    </div>
  );
}
