"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { primaryClass } from "@/lib/classes";
import { formatMoney, formatDate } from "@/lib/format";
import { getSearchedTrips, deleteTrip } from "@/lib/data/trips";
import { SearchedTrip } from "@/lib/api-types";
import { useSessionUser } from "@/components/auth/use-session-user";

export default function SearchesPage() {
  const user = useSessionUser();
  const [trips, setTrips] = useState<SearchedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSearchedTrips();
        setTrips(data || []);
      } catch (err) {
        console.error("Failed to load searched trips:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleDelete(tripId: string) {
    if (!confirm("Are you sure you want to delete this searched trip?")) return;
    try {
      setDeletingId(tripId);
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
      alert("Failed to delete trip. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-rust">Trip History</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
            Searched Trips
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Revisit your live flight searches, view AI card recommendations, and book with one click.
          </p>
        </div>
        <Link
          href="/plan"
          className="self-start rounded-full bg-marigold px-6 py-2.5 text-sm font-semibold text-[#2a1a00] hover:opacity-90 transition-opacity"
        >
          + Search New Flight
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl border border-line bg-card p-12 text-center text-sm text-foreground/60 animate-pulse">
          Loading your searched trips…
        </div>
      ) : trips.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-card px-4 py-16 text-center">
          <p className="font-display text-2xl text-mist">No Searched Trips Yet</p>
          <p className="mt-2 text-sm text-foreground/70 max-w-md mx-auto">
            You haven’t searched for any flights yet. Use our planner to search live airline routes and reveal your hacked card price.
          </p>
          <Link href="/plan" className={`${primaryClass} mt-6 inline-block`}>
            Plan a Trip Now →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {trips.map((item) => {
            const legs = item.input?.legs || [];
            const routeTitle =
              legs.length > 0
                ? legs.map((l) => l.from).concat(legs[legs.length - 1]?.to).join(" → ")
                : "Flight Search";
            const travelDate = legs[0]?.date ? formatDate(legs[0].date) : "Upcoming";
            const cabin = item.input?.cabin || "economy";
            const passengers = item.input?.passengers || 1;
            const topOffer = item.topOffer;
            const currency = topOffer?.currency || item.savings?.currency || "EUR";
            const normalPrice = topOffer?.totalMinor || item.savings?.normalPriceMinor || 0;
            const hackedPrice = item.savings?.best?.hackedPriceMinor ?? normalPrice;
            const savingsAmount = item.savings?.best?.savingsMinor || 0;
            const savingsPct = item.savings?.best?.savingsPct || 0;
            const aiPlan = item.aiPlan;
            const winningCard =
              item.savings?.best?.payCardId ||
              item.savings?.assumptions?.[0] ||
              "Winning Card";

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-line bg-card p-6 sm:p-7 card-hover shadow-sm"
              >
                {/* Header: Route & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/40 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background">
                      {item.kind === "full" ? "Multi-Leg" : "Flight"}
                    </span>
                    <span className="rounded-full border border-line px-3 py-1 text-xs text-foreground/70 capitalize">
                      {cabin}
                    </span>
                    <span className="rounded-full border border-line px-3 py-1 text-xs text-foreground/70">
                      {passengers} {passengers === 1 ? "passenger" : "passengers"}
                    </span>
                    <span className="text-xs text-foreground/50 ml-1">
                      {travelDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground/50">
                      Searched {item.createdAt ? formatDate(item.createdAt) : "Recently"}
                    </span>
                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-medium text-rust hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Route Title & Airline */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-mist">
                      {routeTitle}
                    </h2>
                    {topOffer && (
                      <p className="mt-1 text-xs text-foreground/60">
                        {topOffer.slices?.[0]?.carrier || "Airline"} · {item.offersCount} {item.offersCount === 1 ? "offer" : "offers"} found
                      </p>
                    )}
                  </div>

                  {/* Pricing Overview */}
                  <div className="sm:text-right mt-2 sm:mt-0">
                    {savingsAmount > 0 ? (
                      <div>
                        <span className="text-xs text-foreground/60 line-through">
                          {formatMoney(normalPrice, currency)}
                        </span>
                        <div className="flex items-baseline sm:justify-end gap-2">
                          <span className="font-display text-3xl font-bold text-mint">
                            {formatMoney(hackedPrice, currency)}
                          </span>
                          <span className="rounded-full bg-mint/15 px-2 py-0.5 text-xs font-bold text-mint">
                            {savingsPct}% OFF
                          </span>
                        </div>
                        <p className="text-xs text-mint">
                          Save {formatMoney(savingsAmount, currency)}
                        </p>
                      </div>
                    ) : (
                      <span className="font-display text-2xl font-bold text-mist">
                        {formatMoney(normalPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Recommendation Highlight Box */}
                {aiPlan && (
                  <div className="mt-5 rounded-2xl border border-marigold/30 bg-marigold/10 p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-marigold animate-pulse" />
                      <p className="text-xs font-bold uppercase tracking-wider text-marigold">
                        AI Travel Hacking Recommendation
                      </p>
                    </div>
                    <p className="mt-2 font-display text-lg font-semibold text-mist">
                      {aiPlan.headline}
                    </p>
                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                      {aiPlan.summary}
                    </p>

                    {/* Quick Steps Preview */}
                    {aiPlan.steps && aiPlan.steps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-marigold/20 space-y-1.5">
                        {aiPlan.steps.slice(0, 2).map((s, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-foreground/75">
                            <span className="font-bold text-marigold">{idx + 1}.</span>
                            <span>
                              <strong className="text-mist">{s.title}:</strong> {s.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions: Book & View Details */}
                <div className="mt-6 pt-5 border-t border-line/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    href={`/results/${item.id}`}
                    className="text-sm font-semibold text-foreground/80 hover:text-mist hover:underline"
                  >
                    View All {item.offersCount} Offers & Card Comparison →
                  </Link>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {topOffer && (
                      <Link
                        href={`/book/${item.id}?offerId=${topOffer.offerId}`}
                        className="w-full sm:w-auto text-center rounded-full bg-marigold px-6 py-2.5 text-sm font-semibold text-[#2a1a00] hover:opacity-90 transition-opacity"
                      >
                        Book this flight →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

