"use client";

import type { FormEvent, ReactNode } from "react";

export function PreviewForm({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
