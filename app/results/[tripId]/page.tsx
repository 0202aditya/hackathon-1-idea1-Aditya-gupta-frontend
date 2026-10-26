import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ResultsView } from "@/components/results-view";
import { trips, type PreviewId } from "@/lib/preview";

function isPreview(id: string): id is PreviewId {
  return id === "quick" || id === "full";
}

async function ResultsContent({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  if (!isPreview(tripId)) notFound();
  return <ResultsView trip={trips[tripId]} />;
}

export default function ResultsPage({ params }: { params: Promise<{ tripId: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-foreground/60">Opening the sample…</p>}>
      <ResultsContent params={params} />
    </Suspense>
  );
}
