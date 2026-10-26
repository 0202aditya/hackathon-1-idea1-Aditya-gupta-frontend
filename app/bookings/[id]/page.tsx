import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ConfirmationView } from "@/components/confirmation-view";
import { trips, type PreviewId } from "@/lib/preview";

function isPreview(id: string): id is PreviewId {
  return id === "quick" || id === "full";
}

async function ConfirmationContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isPreview(id)) notFound();
  return <ConfirmationView trip={trips[id]} />;
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-foreground/60">Opening the sample…</p>}>
      <ConfirmationContent params={params} />
    </Suspense>
  );
}
