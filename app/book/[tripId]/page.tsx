import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BookView } from "@/components/book-view";
import { trips, type PreviewId } from "@/lib/preview";

function isPreview(id: string): id is PreviewId {
  return id === "quick" || id === "full";
}

async function BookContent({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  if (!isPreview(tripId)) notFound();
  return <BookView trip={trips[tripId]} />;
}

export default function BookPage({ params }: { params: Promise<{ tripId: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-foreground/60">Opening the sample…</p>}>
      <BookContent params={params} />
    </Suspense>
  );
}
