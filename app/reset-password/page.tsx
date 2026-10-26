import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl tracking-tight">Choose a new password</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Pick a new password. Saving it returns you to login.
      </p>
      <ResetPasswordForm className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-5" />
    </div>
  );
}
