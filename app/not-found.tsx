import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <h1 className="font-display text-3xl">That screen is not in the preview.</h1>
      <p className="mt-3 text-sm text-foreground/70">
        The sample trips are the Delhi–Mumbai flight and the Delhi–Dubai–London trip.
      </p>
      <Link href="/plan" className="mt-6 inline-block text-sm font-medium text-rust">
        Back to plan a trip
      </Link>
    </div>
  );
}
