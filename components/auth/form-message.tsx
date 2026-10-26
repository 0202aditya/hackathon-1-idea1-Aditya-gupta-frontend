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
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-line bg-sand/60 text-foreground"
      }`}
    >
      {children}
    </p>
  );
}
