import Link from "next/link";
import { primaryClass, secondaryClass } from "@/lib/classes";

const points = [
  {
    title: "Normal fare, then the hacked fare",
    body: "The savings number sits above everything else, in one colour, before the explanation.",
  },
  {
    title: "Points you hold, and points you’ll earn",
    body: "A card can pay for part of the ticket and still earn rewards on the rest.",
  },
  {
    title: "One class for the whole trip",
    body: "Economy through first. A quick flight, or up to four legs.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-rust">
        Indian cards, applied to the fare
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
        See what the ticket costs after your points.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/80">
        Una Milla puts the airline price next to the price your cards can get you, then shows which
        card to pay with.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/plan" className={primaryClass}>
          Check a trip
        </Link>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-3">
        {points.map((point) => (
          <li key={point.title} className="rounded-3xl border border-line bg-card p-5">
            <h2 className="font-display text-xl leading-snug">{point.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{point.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
