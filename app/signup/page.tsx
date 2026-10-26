import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl tracking-tight">Create an account</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Sign up with your email and a password of at least 6 characters.
      </p>
      <SignupForm className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-5" />
      <p className="mt-4 text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-rust">
          Log in
        </Link>
      </p>
    </div>
  );
}
