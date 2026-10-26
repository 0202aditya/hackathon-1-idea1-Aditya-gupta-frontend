import Link from "next/link";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SearchParamNotice } from "@/components/auth/search-param-notice";
import { secondaryClass } from "@/lib/classes";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl tracking-tight">Forgot password</h1>
      <p className="mt-2 text-sm leading-relaxed text-foreground/70">
        Enter your email. If that address has an account, we&apos;ll send a link to choose a new password.
      </p>
      <div className="mt-6 empty:hidden">
        <Suspense fallback={null}>
          <SearchParamNotice
            param="error"
            value="link"
            kind="error"
            message="That reset link is invalid or has expired. Request a new one."
          />
        </Suspense>
      </div>
      <ForgotPasswordForm className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-5" />
      <p className="mt-4 text-sm">
        <Link href="/login" className={secondaryClass}>
          Back to login
        </Link>
      </p>
    </div>
  );
}
