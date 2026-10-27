"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { primaryClass } from "@/lib/classes";
import { formatMoney, formatTime, formatDate } from "@/lib/format";
import { AiPlan, FlightOffer, SavingsResult, TripInput } from "@/lib/api-types";
import { getTripPlan, getTripSavings } from "@/lib/data/trips";

export function LiveResultsView({
  tripId,
  trip,
  offers,
}: {
  tripId: string;
  trip: TripInput;
  offers: FlightOffer[];
}) {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    offers[0]?.offerId || ""
  );

  const [savings, setSavings] = useState<SavingsResult | null>(null);
  const [aiPlan, setAiPlan] = useState<AiPlan | null>(null);
  const [loadingSavings, setLoadingSavings] = useState(true);
  const [loadingAi, setLoadingAi] = useState(true);

  const selectedOffer =
    offers.find((o) => o.offerId === selectedOfferId) || offers[0];

  // Fetch deterministic card savings & AI strategy whenever the selected offer changes
  useEffect(() => {
    if (!selectedOfferId) return;

    let active = true;

    async function loadCalculations() {
      setLoadingSavings(true);
      setLoadingAi(true);

      try {
        const s = await getTripSavings(tripId, selectedOfferId);
        if (active) {
          setSavings(s);
          setLoadingSavings(false);
        }

        const plan = await getTripPlan(tripId, selectedOfferId);
        if (active) {
          setAiPlan(plan);
          setLoadingAi(false);
        }
      } catch (err) {
        console.error("Failed to load savings or AI plan:", err);
        if (active) {
          setLoadingSavings(false);
          setLoadingAi(false);
        }
      }
    }

    loadCalculations();

    return () => {
      active = false;
    };
  }, [tripId, selectedOfferId]);

  if (!offers || offers.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">No flights found</h1>
        <p className="mt-3 text-foreground/70">
          Duffel did not find any available flights for this route and cabin class.
        </p>
        <Link href="/plan" className={`${primaryClass} mt-6 inline-block`}>
          Try another search
        </Link>
      </div>
    );
  }

  const normalPrice = selectedOffer ? selectedOffer.totalMinor : 0;
  const currency = selectedOffer?.currency || "EUR";
  const hackedPrice = savings ? savings.best.hackedPriceMinor : normalPrice;
  const totalSavings = savings ? savings.best.savingsMinor : 0;
  const savingsPct = savings ? savings.best.savingsPct : 0;
  const heldPointsOffset = savings?.best.heldPointsOffsetMinor || 0;
  const spendPointsOffset = savings?.best.spendPointsOffsetMinor || 0;
  const earnBack = savings ? savings.best.earnBackMinor : 0;
  const spendMonths = savings?.projection?.monthsUntilDeparture || 0;
  const bestCardName = aiPlan?.headline || savings?.assumptions?.[0] || "Your Card";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Top badges */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-sand px-3 py-1 font-medium capitalize text-background">
          {trip.cabin || selectedOffer?.cabin}
        </span>
        <span className="rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-mint font-medium text-xs">
          Live Duffel test search
        </span>
        <span className="rounded-full border border-line px-3 py-1 text-foreground/70 text-xs">
          {trip.passengers || 1} {trip.passengers === 1 ? "passenger" : "passengers"}
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
        {trip.legs && trip.legs.length > 0
          ? trip.legs.map((l) => l.from).concat(trip.legs[trip.legs.length - 1]?.to).join(" → ")
          : "Your Trip"}
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Found {offers.length} available flight {offers.length === 1 ? "offer" : "offers"} from Duffel.
      </p>

      {/* Hero Savings Card */}
      {selectedOffer && (
        <div className="mt-8 rounded-3xl border border-mint/30 bg-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                Airline Ticket Price
              </p>
              <p className="mt-1 font-display text-3xl sm:text-4xl text-mist/60 line-through">
                {formatMoney(normalPrice, currency)}
              </p>
              <div className="mt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-mint">
                  Calculated Hacked Price
                </span>
                <p className="mt-1 font-display text-5xl sm:text-6xl text-mint">
                  {loadingSavings ? "Calculating…" : formatMoney(hackedPrice, currency)}
                </p>
                {savings && savingsPct > 0 && (
                  <p className="text-sm font-semibold text-mint mt-1">
                    You save {formatMoney(totalSavings, currency)} ({savingsPct}% off)
                  </p>
                )}
              </div>
            </div>
            <div>
              <Link
                href={`/book/${tripId}?offerId=${selectedOffer.offerId}`}
                className={`${primaryClass} inline-block text-center px-8 py-3.5`}
              >
                Book this flight →
              </Link>
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3 pt-6 border-t border-line/40">
            {/* 1. Currently Held Points */}
            <div className="rounded-2xl border border-line bg-background/60 p-4">
              <p className="text-xs text-foreground/60">Points You Hold (Discount)</p>
              <p className="mt-1 font-display text-2xl text-mint">
                {loadingSavings ? "…" : formatMoney(heldPointsOffset, currency)}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                {heldPointsOffset > 0
                  ? "Wiped off from your held points"
                  : "0 points currently held in wallet"}
              </p>
            </div>

            {/* 2. Projected Monthly Spend Points */}
            <div className="rounded-2xl border border-line bg-background/60 p-4">
              <p className="text-xs text-foreground/60">Projected Spend Points</p>
              <p className="mt-1 font-display text-2xl text-mint">
                {loadingSavings ? "…" : formatMoney(spendPointsOffset, currency)}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                {spendMonths > 0 && spendPointsOffset > 0
                  ? `Accumulated from ${spendMonths} months spending`
                  : "0 accumulated spend points"}
              </p>
            </div>

            {/* 3. New Rewards on Flight Purchase */}
            <div className="rounded-2xl border border-line bg-background/60 p-4">
              <p className="text-xs text-foreground/60">New Rewards Earned</p>
              <p className="mt-1 font-display text-2xl text-marigold">
                {loadingSavings ? "…" : formatMoney(earnBack, currency)}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Earned back on remaining cash payment
              </p>
            </div>
          </div>

          {/* AI Recommendation Box */}
          <div className="mt-6 rounded-2xl border border-marigold/30 bg-marigold/10 p-5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-marigold animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-marigold">
                Gemini AI Recommendation · Best Card to Use
              </p>
            </div>
            {loadingAi ? (
              <p className="mt-2 text-sm text-foreground/70 animate-pulse">
                Gemini is analyzing your cards and calculating the optimal booking route…
              </p>
            ) : aiPlan ? (
              <div className="mt-3">
                <p className="font-display text-xl text-mist font-semibold">
                  {aiPlan.headline}
                </p>
                <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                  {aiPlan.summary}
                </p>

                {/* Steps */}
                {aiPlan.steps && aiPlan.steps.length > 0 && (
                  <div className="mt-4 space-y-2.5 pt-3 border-t border-marigold/20">
                    <p className="text-xs font-semibold text-foreground/60 uppercase">
                      Action Plan
                    </p>
                    {aiPlan.steps.map((st, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <span className="font-display font-bold text-marigold shrink-0 mt-0.5">
                          {idx + 1}.
                        </span>
                        <div>
                          <span className="font-medium text-mist">{st.title}: </span>
                          <span className="text-foreground/75">{st.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* List of all flight offers from Duffel */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Available Flight Offers</h2>
          <span className="text-xs text-foreground/60">Sorted by lowest price</span>
        </div>

        <div className="mt-4 space-y-3">
          {offers.map((offer) => {
            const isSelected = offer.offerId === selectedOfferId;
            return (
              <div
                key={offer.offerId}
                onClick={() => setSelectedOfferId(offer.offerId)}
                className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                  isSelected
                    ? "border-marigold bg-white/5 ring-1 ring-marigold/50"
                    : "border-line bg-card hover:border-white/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Slices information */}
                  <div className="space-y-3 flex-1">
                    {offer.slices.map((slice, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-4 text-sm">
                        <div className="min-w-28">
                          <span className="font-semibold text-mist">
                            {slice.carrier}
                          </span>
                          <span className="block text-xs text-foreground/60">
                            {slice.stops === 0 ? "Nonstop" : `${slice.stops} stop`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="font-medium text-base">
                              {slice.origin}
                            </span>
                            {slice.departingAt && (
                              <span className="block text-xs text-foreground/60">
                                {formatTime(slice.departingAt)}
                              </span>
                            )}
                          </div>
                          <span className="text-foreground/40 px-2">→</span>
                          <div>
                            <span className="font-medium text-base">
                              {slice.destination}
                            </span>
                            {slice.arrivingAt && (
                              <span className="block text-xs text-foreground/60">
                                {formatTime(slice.arrivingAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price & Selection */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-line/40">
                    <span className="font-display text-2xl font-bold text-mint">
                      {formatMoney(offer.totalMinor, offer.currency)}
                    </span>
                    <button
                      type="button"
                      className={`mt-2 rounded-full px-4 py-1.5 text-xs font-semibold ${
                        isSelected
                          ? "bg-marigold text-[#2a1a00]"
                          : "border border-line text-mist/80 hover:text-mist"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Back button */}
      <div className="mt-10 pt-6 border-t border-line/40 flex justify-between items-center">
        <Link href="/plan" className="text-sm text-rust hover:underline">
          ← Plan another trip
        </Link>
        <span className="text-xs text-foreground/50">
          Source: Live Duffel Sandbox Air API & Gemini AI
        </span>
      </div>
    </div>
  );
}
