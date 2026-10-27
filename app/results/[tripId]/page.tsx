import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ResultsView } from "@/components/results-view";
import { LiveResultsView } from "@/components/live-results-view";
import { trips, type PreviewId } from "@/lib/preview";
import { TripDetails } from "@/lib/data/trips";

function isPreview(id: string): id is PreviewId {
  return id === "quick" || id === "full";
}

async function fetchBackendTrip(tripId: string): Promise<TripDetails | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${apiBase}/api/trips/${tripId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as TripDetails;
  } catch (err) {
    console.error("Error fetching trip:", err);
    return null;
  }
}

async function ResultsContent({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  if (isPreview(tripId)) {
    return <ResultsView trip={trips[tripId]} />;
  }

  const data = await fetchBackendTrip(tripId);

  if (!data || !data.trip) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl">Trip not found</h1>
        <p className="mt-2 text-sm text-foreground/70">
          We could not find the flight search results for this trip.
        </p>
        <Link
          href="/plan"
          className="mt-6 inline-block rounded-full bg-marigold px-4 py-2 text-sm font-semibold text-[#2a1a00]"
        >
          Plan a new trip
        </Link>
      </div>
    );
  }

  return (
    <LiveResultsView
      tripId={tripId}
      trip={data.trip}
      offers={data.offers || []}
    />
  );
}

export default function ResultsPage({ params }: { params: Promise<{ tripId: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="font-display text-xl animate-pulse text-mist">
            Loading flight offers from Duffel…
          </p>
        </div>
      }
    >
      <ResultsContent params={params} />
    </Suspense>
  );
}
