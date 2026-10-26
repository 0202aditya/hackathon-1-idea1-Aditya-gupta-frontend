import Link from "next/link";
import { primaryClass } from "@/lib/classes";
import type { PreviewTrip } from "@/lib/preview";

export function ResultsView({ trip }: { trip: PreviewTrip }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-sand px-3 py-1 font-medium">{trip.cabin}</span>
        <span className="rounded-full border border-line px-3 py-1 text-foreground/70">
          Sample fares
        </span>
      </div>
      <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">{trip.title}</h1>
      <p className="mt-2 text-sm text-foreground/70">
        {trip.summary} · {trip.flight}
      </p>

      <p className="mt-8 text-sm font-medium uppercase tracking-[0.14em] text-foreground/55">
        You save
      </p>
      <p className="font-display text-6xl tracking-tight text-rust sm:text-8xl">{trip.savings}</p>
      <p className="mt-1 text-foreground/70">{trip.savingsPct}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <PriceTile label="Normal price" amount={trip.normal} />
        <PriceTile label="Hacked price" amount={trip.hacked} emphasis />
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-4">
          <dt className="text-sm text-foreground/60">Points you hold</dt>
          <dd className="mt-1 font-display text-2xl">{trip.held}</dd>
          <dd className="text-sm text-foreground/60">{trip.heldNote}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-card p-4">
          <dt className="text-sm text-foreground/60">New rewards earned</dt>
          <dd className="mt-1 font-display text-2xl">{trip.earned}</dd>
          <dd className="text-sm text-foreground/60">On the part you still pay</dd>
        </div>
      </dl>

      <p className="mt-4 inline-flex rounded-full bg-foreground px-3 py-1 text-sm text-card">
        Best card · {trip.bestCard}
      </p>

      <section className="mt-8">
        <h2 className="font-display text-xl">Other cards</h2>
        <ul className="mt-3 space-y-2">
          {trip.alternatives.map((item) => (
            <li
              key={item.card}
              className="flex flex-col rounded-2xl border border-line bg-card px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium">{item.card}</span>
              <span className="text-foreground/70">{item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">How to do it</h2>
        <ol className="mt-3 space-y-3">
          {trip.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-2xl bg-card p-4">
              <span className="font-display text-lg text-rust">{index + 1}</span>
              <span>
                <span className="block font-medium">{step.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-foreground/70">
                  {step.detail}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <ul className="mt-6 space-y-2">
        {trip.warnings.map((warning) => (
          <li
            key={warning}
            className="rounded-2xl border border-rust/40 bg-rust/10 px-4 py-3 text-sm"
          >
            {warning}
          </li>
        ))}
      </ul>

      <details className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium">How we calculated this</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground/75">
          {trip.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>

      <div className="mt-8">
        <Link href={`/book/${trip.id}`} className={primaryClass}>
          Book this flight
        </Link>
      </div>
    </div>
  );
}

function PriceTile({
  label,
  amount,
  emphasis = false,
}: {
  label: string;
  amount: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${emphasis ? "border-rust bg-card" : "border-line bg-card"}`}>
      <p className="text-sm text-foreground/60">{label}</p>
      <p className="mt-1 font-display text-3xl">{amount}</p>
    </div>
  );
}
