import type { AuthError } from "@supabase/supabase-js";

const messagesByCode: Record<string, string> = {
  invalid_credentials: "That email and password don't match an account.",
  email_not_confirmed: "Confirm your email first, then log in.",
  user_already_exists: "An account with this email already exists. Try logging in.",
  email_exists: "An account with this email already exists. Try logging in.",
  weak_password: "That password is too weak. Use at least 6 characters.",
  same_password: "The new password must be different from the old one.",
  over_email_send_rate_limit: "Too many emails sent. Wait a minute and try again.",
  over_request_rate_limit: "Too many attempts. Wait a minute and try again.",
  session_not_found: "Your reset link has expired. Request a new one.",
};

export function authErrorMessage(error: AuthError | Error | unknown) {
  if (error && typeof error === "object") {
    const code = "code" in error && typeof error.code === "string" ? error.code : undefined;
    if (code && messagesByCode[code]) return messagesByCode[code];
    if (error instanceof Error && error.name === "AuthSessionMissingError") {
      return messagesByCode.session_not_found;
    }
    if (error instanceof Error && error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
