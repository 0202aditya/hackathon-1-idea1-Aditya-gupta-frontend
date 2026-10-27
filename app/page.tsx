"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { primaryClass } from "@/lib/classes";
import { useSessionUser } from "@/components/auth/use-session-user";

const features = [
  {
    step: "01",
    title: "Live Airline Fares",
    body: "Search real flights across Indian and international routes powered by Duffel. Economy, Premium Economy, Business, or First.",
  },
  {
    step: "02",
    title: "Points Redemption Offset",
    body: "Enter your cards (HDFC Infinia, Axis Atlas, Amex, SBI). We calculate exactly how much of the ticket your existing points can wipe out.",
  },
  {
    step: "03",
    title: "Optimized Earn-Back",
    body: "Discover the best card to pay the remaining balance with, maximizing accelerated airline multipliers (up to 16.6% return).",
  },
];

const cardsPreview = [
  "HDFC Infinia",
  "Axis Atlas",
  "Amex Platinum Travel",
  "SBI Cashback",
  "HDFC Regalia Gold",
  "Axis Magnus",
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const user = useSessionUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && Boolean(user);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[url('/hero-flight.png')] bg-cover bg-top bg-no-repeat">
      <div className="absolute inset-0 bg-night/60 backdrop-blur-[0.5px]" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:py-20">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1 text-xs font-semibold text-mint">
          <span>Smart Travel Hacking for Indian Cards</span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          Stop paying full cash for flights.
        </h1>

        {/* Subhead */}
        <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-foreground/80">
          Una Milla compares live airline ticket prices against the reward points you hold, revealing your true <span className="text-mint font-semibold">Hacked Price</span> and the exact card to book with.
        </p>

        {/* Hero CTA: Dynamic based on logged in status */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link href="/wallet" className={`${primaryClass} text-center text-base px-8 py-3.5`}>
            {isLoggedIn ? "Manage your Wallet →" : "Set up your cards & savings →"}
          </Link>
          {isLoggedIn ? (
            <Link
              href="/searches"
              className="rounded-full border border-line bg-card/80 px-6 py-3.5 text-center text-sm font-semibold text-mist hover:border-white/30 transition-colors"
            >
              View Searched Trips →
            </Link>
          ) : (
            <Link
              href="/signup"
              className="rounded-full border border-line bg-card/80 px-6 py-3.5 text-center text-sm font-semibold text-mist hover:border-white/30 transition-colors"
            >
              Create free account
            </Link>
          )}
        </div>

        {/* Supported Cards Pill Strip */}
        <div className="mt-12 pt-8 border-t border-line/40">
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            Works with India’s top travel & cashback cards
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cardsPreview.map((card) => (
              <span
                key={card}
                className="rounded-full border border-line bg-card/60 px-3 py-1 text-xs font-medium text-foreground/75"
              >
                {card}
              </span>
            ))}
            <span className="rounded-full border border-line/40 px-3 py-1 text-xs text-foreground/50">
              + 6 more
            </span>
          </div>
        </div>

        {/* 3 Step Feature Flow */}
        <div className="mt-14">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight">
            How Una Milla hacks your ticket
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative rounded-3xl border border-line bg-card/80 backdrop-blur-sm p-6 flex flex-col justify-between card-hover hover:border-line/90 shadow-sm"
              >
                <div>
                  <span className="font-display text-sm font-bold text-rust">
                    {feature.step}
                  </span>
                  <h3 className="mt-2 font-display text-xl leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Value Banner */}
        <div className="mt-12 rounded-3xl border border-line bg-card/80 backdrop-blur-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl">
              Never guess which credit card to use at checkout.
            </h3>
            <p className="mt-1 text-sm text-foreground/70 max-w-xl">
              No card numbers or bank credentials required. Just enter your points balance and let the engine find your optimal fare.
            </p>
          </div>
          <Link
            href="/plan"
            className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-[#2a1a00] hover:opacity-90 shrink-0 transition-opacity"
          >
            Plan a trip
          </Link>
        </div>
      </div>
    </div>
  );
}
