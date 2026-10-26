import type { PreviewTrip } from "@/lib/preview";

export function ConfirmationView({ trip }: { trip: PreviewTrip }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <p className="text-sm font-medium text-mint">Booking confirmed · sample</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{trip.reference}</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Demo booking: test mode, no real payment. Nothing was sent to an airline.
      </p>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-4">
          <dt className="text-sm text-foreground/60">Total</dt>
          <dd className="font-display text-3xl text-mint">{trip.hacked}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <dt className="text-sm text-foreground/60">Pay with</dt>
          <dd className="font-display text-2xl">{trip.bestCard}</dd>
          <dd className="text-sm text-foreground/60">{trip.cabin}</dd>
        </div>
      </dl>

      <h2 className="mt-8 font-display text-xl">Itinerary</h2>
      <ol className="mt-3 space-y-3">
        {trip.legs.map((leg) => (
          <li key={`${leg.from}-${leg.when}`} className="rounded-2xl border border-line bg-card p-4">
            <p className="font-medium">
              {leg.from} → {leg.to}
            </p>
            <p className="mt-1 text-sm text-foreground/65">
              {leg.when} · {leg.carrier}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm text-foreground/70">Passenger: Priya Sharma</p>
    </div>
  );
}
