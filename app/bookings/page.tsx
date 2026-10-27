"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { primaryClass } from "@/lib/classes";
import { formatMoney, formatDate } from "@/lib/format";
import { getBookings, BookingRecord } from "@/lib/data/trips";
import { useSessionUser } from "@/components/auth/use-session-user";

export default function BookingsPage() {
  const user = useSessionUser();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-rust">Account</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">My Bookings</h1>
          <p className="mt-2 text-sm text-foreground/70">
            View your confirmed flight bookings, airline references, and travel receipts.
          </p>
        </div>
        <Link
          href="/searches"
          className="self-start rounded-full border border-line bg-card px-5 py-2 text-sm font-semibold text-mist hover:border-white/30 transition-colors"
        >
          View Searched Trips →
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl border border-line bg-card p-12 text-center text-sm text-foreground/60 animate-pulse">
          Loading your bookings…
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-card px-4 py-16 text-center">
          <p className="font-display text-2xl text-mist">No Confirmed Bookings Yet</p>
          <p className="mt-2 text-sm text-foreground/70 max-w-md mx-auto">
            You don't have any confirmed flights yet. Revisit your searched trips to review live fares and AI card recommendations.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/searches"
              className="rounded-full bg-marigold px-6 py-2.5 text-sm font-semibold text-[#2a1a00] hover:opacity-90 transition-opacity"
            >
              View Searched Trips →
            </Link>
            <Link
              href="/plan"
              className="rounded-full border border-line bg-white/5 px-6 py-2.5 text-sm font-semibold text-mist hover:bg-white/10 transition-colors"
            >
              Plan a New Trip
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((b) => {
            const legs = b.trips?.input?.legs || [];
            const title =
              legs.length > 0
                ? legs.map((l) => l.from).concat(legs[legs.length - 1]?.to).join(" → ")
                : `Booking ${b.bookingReference || b.id.slice(0, 8)}`;
            const cabin = b.trips?.input?.cabin || "economy";
            const dateStr = legs[0]?.date ? formatDate(legs[0].date) : formatDate(b.createdAt);
            const total = b.totalMinor || 0;
            const currency = b.currency || "EUR";

            return (
              <li key={b.id} className="rounded-3xl border border-line bg-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-semibold text-mint uppercase">
                        {b.status}
                      </span>
                      <span className="text-xs text-foreground/50">
                        Ref: {b.bookingReference || b.duffelOrderId || b.id.slice(0, 8)}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl">{title}</h2>
                    <p className="text-sm text-foreground/60 capitalize mt-0.5">
                      {cabin} · {dateStr}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="font-display text-2xl font-bold text-mint">
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
