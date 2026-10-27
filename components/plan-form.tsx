"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";
import { createTrip } from "@/lib/data/trips";
import { Cabin, TripInput } from "@/lib/api-types";

const cabins = ["Economy", "Premium economy", "Business", "First"];

const cabinMap: Record<string, Cabin> = {
  Economy: "economy",
  "Premium economy": "premium_economy",
  Business: "business",
  First: "first",
};

export function PlanForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [showReturn, setShowReturn] = useState(false);
  const [returnDate, setReturnDate] = useState("");

  const [fullLegs, setFullLegs] = useState([
    { from: "", to: "", date: "" },
    { from: "", to: "", date: "" },
    { from: "", to: "", date: "" },
  ]);
  const [legCount, setLegCount] = useState(3);

  const [passengers, setPassengers] = useState(1);
  const [selectedCabin, setSelectedCabin] = useState("Economy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = mode === "quick" ? "/results/quick" : "/results/full";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cabin = cabinMap[selectedCabin] || "economy";
      let input: TripInput;

      if (mode === "quick") {
        const legs = [{ from, to, date: departDate }];
        if (showReturn) {
          legs.push({ from: to, to: from, date: returnDate });
        }
        input = {
          kind: "quick",
          legs,
          passengers,
          cabin,
        };
      } else {
        input = {
          kind: "full",
          legs: fullLegs.slice(0, legCount),
          passengers,
          cabin,
        };
      }

      const res = await createTrip(input);
      if (res && res.tripId) {
        router.push(`/results/${res.tripId}`);
      } else {
        throw new Error("No trip ID received from backend.");
      }
    } catch (err: any) {
      console.error("Flight search error:", err);
      setError(
        err?.message ||
          "Failed to find flight offers. Please check dates and airport codes or try another travel class."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateFullLeg(index: number, field: "from" | "to" | "date", value: string) {
    setFullLegs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-rust">Plan a trip</p>
        <span className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-semibold text-mint">
          Duffel live test
        </span>
      </div>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
        Where are you flying?
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
        Enter your route and travel class to search live test flight offers powered by Duffel.
      </p>

      {error ? (
        <div className="mt-4 rounded-2xl border border-glow/40 bg-glow/15 p-4 text-sm text-glow">
          <p className="font-semibold">Search notice</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 rounded-full bg-white/10 p-1">
        {(
          [
            ["quick", "Quick flight"],
            ["full", "Full trip"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              mode === value ? "bg-dusk text-mist" : "text-mist/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-4 sm:p-6"
        onSubmit={handleSubmit}
      >
        {mode === "quick" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>From</span>
                <input
                  className={inputClass}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. Delhi (DEL)"
                  required
                />
              </label>
              <label className="block">
                <span className={labelClass}>To</span>
                <input
                  className={inputClass}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Mumbai (BOM)"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className={labelClass}>Depart</span>
              <input
                className={inputClass}
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                required
              />
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showReturn}
                onChange={(event) => setShowReturn(event.target.checked)}
                className="size-4 accent-marigold"
              />
              Add a return
            </label>
            {showReturn ? (
              <label className="block">
                <span className={labelClass}>Return</span>
                <input
                  className={inputClass}
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </label>
            ) : null}
          </>
        ) : (
          <div className="space-y-4">
            {fullLegs.slice(0, legCount).map((leg, index) => (
              <fieldset key={index} className="space-y-3 rounded-2xl bg-background p-3">
                <legend className="px-1 text-sm font-medium">Leg {index + 1}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>From</span>
                    <input
                      className={inputClass}
                      value={leg.from}
                      onChange={(e) => updateFullLeg(index, "from", e.target.value)}
                      placeholder="City or airport code (DEL)"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>To</span>
                    <input
                      className={inputClass}
                      value={leg.to}
                      onChange={(e) => updateFullLeg(index, "to", e.target.value)}
                      placeholder="City or airport code (DXB)"
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={labelClass}>Date</span>
                  <input
                    className={inputClass}
                    type="date"
                    value={leg.date}
                    onChange={(e) => updateFullLeg(index, "date", e.target.value)}
                    required
                  />
                </label>
              </fieldset>
            ))}
            {legCount < 4 ? (
              <button
                type="button"
                onClick={() => setLegCount((count) => count + 1)}
                className="text-sm font-medium text-rust hover:underline"
              >
                + Add a leg
              </button>
            ) : (
              <p className="text-sm text-foreground/60">Four legs is the maximum on a full trip.</p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Passengers</span>
            <select
              className={inputClass}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              <option value={1}>1 passenger</option>
              <option value={2}>2 passengers</option>
              <option value={3}>3 passengers</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Travel class</span>
            <select
              key={mode}
              className={inputClass}
              value={selectedCabin}
              onChange={(e) => setSelectedCabin(e.target.value)}
            >
              {cabins.map((cabin) => (
                <option key={cabin} value={cabin}>
                  {cabin}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${primaryClass} w-full text-center cursor-pointer transition-opacity ${
            loading ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          {loading ? "Searching flights on Duffel..." : "Search flights with Duffel"}
        </button>
      </form>
    </div>
  );
}
