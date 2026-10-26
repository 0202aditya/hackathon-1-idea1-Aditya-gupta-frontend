import type { ReactNode } from "react";

export function FormMessage({
  kind,
  children,
}: {
  kind: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-xl border px-3 py-2 text-sm ${
        kind === "error"
          ? "border-glow/50 bg-glow/15 text-mist"
          : "border-mint/40 bg-mint/15 text-mint"
      }`}
    >
      {children}
    </p>
  );
}
