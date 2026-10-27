import Link from "next/link";
import { trips } from "@/lib/preview";

export default function BookingsPage() {
  const items = [trips.quick, trips.full];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">My bookings</h1>
      <div className="mt-4 rounded-2xl border border-line bg-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-foreground/80">
          Looking for flights you recently searched? Check your saved calculations and AI recommendations.
        </p>
        <Link
          href="/searches"
          className="shrink-0 text-sm font-semibold text-mint hover:underline"
        >
          View Searched Trips →
        </Link>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((trip) => (
          <li key={trip.id}>
            <Link
              href={`/bookings/${trip.id}`}
              className="block rounded-3xl border border-line bg-card p-4 transition hover:border-marigold"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-medium">{trip.title}</span>
                  <span className="mt-1 block text-sm text-foreground/60">
                    {trip.reference} · {trip.cabin}
                  </span>
                </span>
                <span className="font-display text-xl text-mint">{trip.hacked}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
