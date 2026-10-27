"use client";

import { useState } from "react";
import Link from "next/link";
import { primaryClass } from "@/lib/classes";
import { formatMoney, formatTime, formatDate } from "@/lib/format";
import { FlightOffer, TripInput } from "@/lib/api-types";

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

  const selectedOffer =
    offers.find((o) => o.offerId === selectedOfferId) || offers[0];

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

  // Calculate estimated points offset (e.g. sample mock credit card savings for preview)
  const normalPrice = selectedOffer ? selectedOffer.totalMinor : 0;
  const estimatedSavings = Math.round(normalPrice * 0.35); // 35% estimate
  const hackedPrice = normalPrice - estimatedSavings;

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
        {trip.legs[0]?.from} → {trip.legs[trip.legs.length - 1]?.to}
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
                Selected Offer Total
              </p>
              <p className="mt-1 font-display text-4xl sm:text-5xl text-mint">
                {formatMoney(selectedOffer.totalMinor, selectedOffer.currency)}
              </p>
              <p className="mt-1 text-xs text-foreground/60">
                Expires {formatDate(selectedOffer.expiresAt)}
              </p>
            </div>
            <div>
              <Link
                href={`/book/${tripId}?offerId=${selectedOffer.offerId}`}
                className={`${primaryClass} inline-block text-center`}
              >
                Book this flight
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 pt-6 border-t border-line/40">
            <div className="rounded-2xl border border-line bg-background/60 p-4">
              <p className="text-xs text-foreground/60">Estimated Hacked Price</p>
              <p className="mt-1 font-display text-2xl text-mint">
                {formatMoney(hackedPrice, selectedOffer.currency)}
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Save ~{formatMoney(estimatedSavings, selectedOffer.currency)} using reward cards
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-background/60 p-4">
              <p className="text-xs text-foreground/60">Best Card Recommendation</p>
              <p className="mt-1 font-display text-xl text-marigold">
                HDFC Infinia / Axis Atlas
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Earn 5X reward points on direct flight booking
              </p>
            </div>
          </div>
        </div>
      )}

      {/* List of all offers */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Available Flight Offers</h2>
          <span className="text-xs text-foreground/60">Sorted by lowest price</span>
        </div>

        <div className="mt-4 space-y-3">
          {offers.map((offer, idx) => {
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
                        <div className="min-w-24">
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
          Source: Live Duffel Sandbox Air API
        </span>
      </div>
    </div>
  );
}

