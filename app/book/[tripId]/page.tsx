import { Suspense } from "react";
import { BookView } from "@/components/book-view";
import { trips, type PreviewId } from "@/lib/preview";

function isPreview(id: string): id is PreviewId {
  return id === "quick" || id === "full";
}

async function BookContent({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams?: Promise<{ offerId?: string }>;
}) {
  const { tripId } = await params;
  const sParams = searchParams ? await searchParams : {};

  if (isPreview(tripId)) {
    return <BookView trip={trips[tripId]} />;
  }

  // Construct a fallback trip view for live booking preview
  const livePreviewTrip = {
    ...trips.quick,
    id: "quick" as PreviewId,
    title: "Live Flight Booking",
    flight: sParams.offerId ? `Duffel Offer ${sParams.offerId.slice(0, 10)}…` : "Duffel Flight",
  };

  return <BookView trip={livePreviewTrip} />;
}

export default function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ tripId: string }>;
  searchParams?: Promise<{ offerId?: string }>;
}) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-sm text-foreground/60">Opening the booking screen…</p>}>
      <BookContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
