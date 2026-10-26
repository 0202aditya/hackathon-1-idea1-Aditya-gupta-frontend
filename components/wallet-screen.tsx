"use client";

import { useMemo, useState } from "react";
import { inputClass, labelClass } from "@/lib/classes";

type WalletCard = {
  id: string;
  name: string;
  issuer: string;
  points: string;
  spend: Record<string, string>;
};

const categories = [
  ["flights", "Flights"],
  ["hotels", "Hotels"],
  ["dining", "Dining"],
  ["online", "Online"],
  ["other", "Other"],
] as const;

const catalog: { id: string; name: string; issuer: string }[] = [
  { id: "infinia", name: "HDFC Infinia", issuer: "HDFC Bank" },
  { id: "regalia", name: "HDFC Regalia Gold", issuer: "HDFC Bank" },
  { id: "millennia", name: "HDFC Millennia", issuer: "HDFC Bank" },
  { id: "magnus", name: "Axis Magnus", issuer: "Axis Bank" },
  { id: "atlas", name: "Axis Atlas", issuer: "Axis Bank" },
  { id: "ace", name: "Axis Ace", issuer: "Axis Bank" },
  { id: "elite", name: "SBI Elite", issuer: "SBI Card" },
  { id: "cashback", name: "SBI Cashback", issuer: "SBI Card" },
  { id: "emeralde", name: "ICICI Emeralde", issuer: "ICICI Bank" },
  { id: "amex", name: "Amex Platinum Travel", issuer: "American Express" },
  { id: "amazon", name: "Amazon Pay ICICI", issuer: "ICICI Bank" },
  { id: "kotak", name: "Kotak White", issuer: "Kotak" },
];

const emptySpend = { flights: "", hotels: "", dining: "", online: "", other: "" };

const startingCards: WalletCard[] = [
  {
    id: "infinia",
    name: "HDFC Infinia",
    issuer: "HDFC Bank",
    points: "45000",
    spend: { flights: "25000", hotels: "8000", dining: "12000", online: "10000", other: "5000" },
  },
  {
    id: "atlas",
    name: "Axis Atlas",
    issuer: "Axis Bank",
    points: "28000",
    spend: { flights: "15000", hotels: "4000", dining: "6000", online: "3000", other: "2000" },
  },
];

export function WalletScreen() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState(startingCards);

  const matches = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return catalog;
    return catalog.filter((card) => `${card.name} ${card.issuer}`.toLowerCase().includes(text));
  }, [query]);

  function addCard(id: string) {
    const found = catalog.find((card) => card.id === id);
    if (!found || cards.some((card) => card.id === id)) return;
    setCards((current) => [
      ...current,
      { ...found, points: "", spend: { ...emptySpend } },
    ]);
    setQuery("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <p className="text-sm font-medium text-rust">Wallet · Priya</p>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Your cards</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/70">
        Card name, points and monthly spend only. This preview never asks for a card number, and
        changes stay on this page until you refresh.
      </p>

      <div className="relative mt-6">
        <label className={labelClass} htmlFor="card-search">
          Add a card
        </label>
        <input
          id="card-search"
          className={inputClass}
          placeholder="Search HDFC, Axis, SBI…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul className="mt-2 max-h-52 overflow-auto rounded-2xl border border-line bg-card">
          {matches.map((card) => {
            const added = cards.some((item) => item.id === card.id);
            return (
              <li key={card.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  disabled={added}
                  onClick={() => addCard(card.id)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-white/10 disabled:cursor-default disabled:text-mist/35"
                >
                  <span>
                    {card.name}
                    <span className="mt-0.5 block text-xs text-foreground/55">{card.issuer}</span>
                  </span>
                  <span>{added ? "Added" : "Add"}</span>
                </button>
              </li>
            );
          })}
          {matches.length === 0 ? (
            <li className="px-3 py-4 text-sm text-foreground/60">No card matches that search.</li>
          ) : null}
        </ul>
      </div>

      {cards.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line bg-card px-4 py-8 text-center text-sm text-foreground/70">
          No cards yet. Add one above. With an empty wallet, the results screen would show only the
          normal fare.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {cards.map((card) => (
            <li key={card.id} className="rounded-3xl border border-line bg-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">{card.name}</h2>
                  <p className="text-sm text-foreground/60">{card.issuer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCards((current) => current.filter((item) => item.id !== card.id))}
                  className="text-sm font-medium text-rust"
                >
                  Remove
                </button>
              </div>
              <label className="mt-4 block max-w-xs">
                <span className={labelClass}>Points balance</span>
                <input className={inputClass} inputMode="numeric" defaultValue={card.points} />
              </label>
              <p className={`${labelClass} mt-4`}>Monthly spend (₹)</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-xs text-foreground/60">{label}</span>
                    <input
                      className={inputClass}
                      inputMode="numeric"
                      defaultValue={card.spend[key]}
                      aria-label={`${card.name} ${label} spend`}
                    />
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
