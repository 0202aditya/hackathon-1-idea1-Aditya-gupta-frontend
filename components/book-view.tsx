import Link from "next/link";
import { PreviewForm } from "@/components/preview-form";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";
import type { PreviewTrip } from "@/lib/preview";

export function BookView({ trip }: { trip: PreviewTrip }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:py-12 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <p className="inline-flex rounded-full bg-rust/15 px-3 py-1 text-sm font-medium text-rust">
          Demo booking: test mode, no real payment
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Passenger</h1>
        <p className="mt-2 text-sm text-foreground/70">
          One form per traveller. This sample has one passenger, filled in so you can see the fields.
        </p>

        <PreviewForm className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Title</span>
              <select className={inputClass} defaultValue="ms">
                <option value="mr">Mr</option>
                <option value="ms">Ms</option>
                <option value="mrs">Mrs</option>
                <option value="miss">Miss</option>
                <option value="dr">Dr</option>
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Gender</span>
              <select className={inputClass} defaultValue="f">
                <option value="f">Female</option>
                <option value="m">Male</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Given name</span>
              <input className={inputClass} defaultValue="Priya" />
            </label>
            <label className="block">
              <span className={labelClass}>Family name</span>
              <input className={inputClass} defaultValue="Sharma" />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>Date of birth</span>
            <input className={inputClass} type="date" defaultValue="1994-06-12" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Email</span>
              <input className={inputClass} type="email" defaultValue="priya@example.com" />
            </label>
            <label className="block">
              <span className={labelClass}>Phone</span>
              <input className={inputClass} type="tel" defaultValue="+919876543210" />
            </label>
          </div>
          <Link href={`/bookings/${trip.id}`} className={primaryClass}>
            Confirm sample booking
          </Link>
        </PreviewForm>
      </div>

      <aside className="h-fit rounded-3xl border border-line bg-card p-5">
        <h2 className="font-display text-xl">Price</h2>
        <p className="mt-1 text-sm text-foreground/60">{trip.title}</p>
        <p className="mt-4 font-display text-4xl text-rust">{trip.hacked}</p>
        <p className="text-sm text-foreground/60">Hacked price · normal was {trip.normal}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt>Class</dt>
            <dd>{trip.cabin}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Pay with</dt>
            <dd>{trip.bestCard}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
