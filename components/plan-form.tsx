"use client";

import { useState } from "react";
import Link from "next/link";
import { inputClass, labelClass, primaryClass } from "@/lib/classes";

const cabins = ["Economy", "Premium economy", "Business", "First"];

const fullLegs = [
  { from: "Delhi (DEL)", to: "Dubai (DXB)", date: "2026-12-04" },
  { from: "Dubai (DXB)", to: "London (LHR)", date: "2026-12-06" },
  { from: "London (LHR)", to: "Delhi (DEL)", date: "2026-12-12" },
  { from: "", to: "", date: "" },
];

export function PlanForm() {
  const [mode, setMode] = useState<"quick" | "full">("quick");
  const [showReturn, setShowReturn] = useState(false);
  const [legCount, setLegCount] = useState(3);

  const destination = mode === "quick" ? "/results/quick" : "/results/full";

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
      <p className="text-sm font-medium text-rust">Plan a trip</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
        Where are you flying?
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
        This is the form only. Submitting opens a sample result, it does not search flights.
      </p>

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
            className={`rounded-full px-3 py-2 text-sm font-medium ${
              mode === value ? "bg-dusk text-mist" : "text-mist/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="mt-6 space-y-4 rounded-3xl border border-line bg-card p-4 sm:p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        {mode === "quick" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>From</span>
                <input className={inputClass} defaultValue="Delhi (DEL)" />
              </label>
              <label className="block">
                <span className={labelClass}>To</span>
                <input className={inputClass} defaultValue="Mumbai (BOM)" />
              </label>
            </div>
            <label className="block">
              <span className={labelClass}>Depart</span>
              <input className={inputClass} type="date" defaultValue="2026-11-18" />
            </label>
            <label className="flex items-center gap-2 text-sm">
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
                <input className={inputClass} type="date" defaultValue="2026-11-22" />
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
                    <input className={inputClass} defaultValue={leg.from} placeholder="City or airport" />
                  </label>
                  <label className="block">
                    <span className={labelClass}>To</span>
                    <input className={inputClass} defaultValue={leg.to} placeholder="City or airport" />
                  </label>
                </div>
                <label className="block">
                  <span className={labelClass}>Date</span>
                  <input className={inputClass} type="date" defaultValue={leg.date} />
                </label>
              </fieldset>
            ))}
            {legCount < 4 ? (
              <button
                type="button"
                onClick={() => setLegCount((count) => count + 1)}
                className="text-sm font-medium text-rust"
              >
                Add a leg
              </button>
            ) : (
              <p className="text-sm text-foreground/60">Four legs is the maximum on a full trip.</p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Passengers</span>
            <select className={inputClass} defaultValue="1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Travel class</span>
            <select key={mode} className={inputClass} defaultValue={mode === "quick" ? "Economy" : "Business"}>
              {cabins.map((cabin) => (
                <option key={cabin}>{cabin}</option>
              ))}
            </select>
          </label>
        </div>

        <Link href={destination} className={primaryClass}>
          {mode === "quick" ? "See the Delhi–Mumbai sample" : "See the full-trip sample"}
        </Link>
        <p className="text-sm text-foreground/60">
          {mode === "quick"
            ? "Opens the economy sample. Changing class here does not recalculate a fare yet."
            : "Opens the business sample for Delhi, Dubai, London and back."}
        </p>
      </form>
    </div>
  );
}
