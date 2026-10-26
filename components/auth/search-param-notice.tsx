"use client";

import { useSearchParams } from "next/navigation";
import { FormMessage } from "@/components/auth/form-message";

export function SearchParamNotice({
  param,
  value,
  kind,
  message,
}: {
  param: string;
  value: string;
  kind: "error" | "success";
  message: string;
}) {
  const searchParams = useSearchParams();
  if (searchParams.get(param) !== value) return null;
  return <FormMessage kind={kind}>{message}</FormMessage>;
}
