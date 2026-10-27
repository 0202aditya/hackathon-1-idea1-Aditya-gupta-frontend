"use client";

import { useEffect, useMemo, useState } from "react";
import { inputClass, labelClass } from "@/lib/classes";
import { UserCard } from "@/lib/api-types";
import { getWallet, saveWalletCard, removeWalletCard } from "@/lib/data/wallet";

const categories = [
  ["flights", "Flights"],
  ["hotels", "Hotels"],
  ["dining", "Dining"],
  ["online", "Online"],
  ["other", "Other"],
] as const;

const catalog = [
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

export function WalletScreen() {
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCardId, setSavingCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing wallet from backend / Supabase
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getWallet();
        setCards(data || []);
      } catch (err) {
        console.error("Failed to load wallet:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAddCard(cardMeta: { id: string; name: string; issuer: string }) {
    if (cards.some((item) => item.cardId === cardMeta.id)) return;

    const newCard: UserCard = {
      cardId: cardMeta.id,
      card: {
        id: cardMeta.id,
        name: cardMeta.name,
        issuer: cardMeta.issuer,
      },
      pointsBalance: 0,
      monthlySpendMinor: {},
    };

    setCards((prev) => [...prev, newCard]);
    setSelectedCatalogId("");

    try {
      setSavingCardId(cardMeta.id);
      setErrorMessage(null);
      await saveWalletCard(cardMeta.id, {
        pointsBalance: 0,
        monthlySpendMinor: {},
      });
    } catch (err: any) {
      console.error("Failed to add card to wallet:", err);
      setErrorMessage(err?.message || "Failed to save card to database.");
    } finally {
      setSavingCardId(null);
    }
  }

  async function handleRemoveCard(cardId: string) {
    setCards((prev) => prev.filter((item) => item.cardId !== cardId));
    try {
      await removeWalletCard(cardId);
    } catch (err) {
      console.error("Failed to remove card:", err);
    }
  }

  async function handlePointsChange(cardId: string, value: string) {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setCards((prev) =>
      prev.map((c) => (c.cardId === cardId ? { ...c, pointsBalance: num } : c))
    );

    const card = cards.find((c) => c.cardId === cardId);
    if (!card) return;

    try {
      setSavingCardId(cardId);
      setErrorMessage(null);
      await saveWalletCard(cardId, {
        pointsBalance: num,
        monthlySpendMinor: card.monthlySpendMinor,
      });
    } catch (err: any) {
      console.error("Failed to update points:", err);
      setErrorMessage(err?.message || "Failed to save points to database.");
    } finally {
      setSavingCardId(null);
    }
  }

  async function handleSpendChange(cardId: string, category: string, value: string) {
    const euros = Math.max(0, parseInt(value, 10) || 0);
    const cents = euros * 100;

    const card = cards.find((c) => c.cardId === cardId);
    if (!card) return;

    const nextSpend = {
      ...card.monthlySpendMinor,
      [category]: cents,
    };

    setCards((prev) =>
      prev.map((c) =>
        c.cardId === cardId ? { ...c, monthlySpendMinor: nextSpend } : c
      )
    );

    try {
      setSavingCardId(cardId);
      setErrorMessage(null);
      await saveWalletCard(cardId, {
        pointsBalance: card.pointsBalance,
        monthlySpendMinor: nextSpend,
      });
    } catch (err: any) {
      console.error("Failed to update monthly spend:", err);
      setErrorMessage(err?.message || "Failed to save monthly spend to database.");
    } finally {
      setSavingCardId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-rust">Wallet</p>
        {savingCardId && (
          <span className="text-xs text-mint animate-pulse">Saving changes…</span>
        )}
      </div>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Your cards</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/70">
        Add the credit cards you hold with your current points balance and estimated monthly spend in €.
        Your wallet is saved securely to your account.
      </p>

      {errorMessage && (
        <div className="mt-4 rounded-2xl border border-glow/40 bg-glow/15 p-4 text-sm text-glow">
          <p className="font-semibold">Notice</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Add Card dropdown selector */}
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 sm:p-5">
        <label className={labelClass} htmlFor="card-select">
          Select a card to add
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-3">
          <select
            id="card-select"
            className={`${inputClass} flex-1 cursor-pointer`}
            value={selectedCatalogId}
            onChange={(e) => setSelectedCatalogId(e.target.value)}
          >
            <option value="">-- Choose from popular Indian credit cards --</option>
            {catalog.map((card) => {
              const alreadyAdded = cards.some((item) => item.cardId === card.id);
              return (
                <option key={card.id} value={card.id} disabled={alreadyAdded}>
                  {card.name} ({card.issuer}){alreadyAdded ? " — Already in wallet" : ""}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            disabled={!selectedCatalogId || cards.some((c) => c.cardId === selectedCatalogId)}
            onClick={() => {
              const found = catalog.find((c) => c.id === selectedCatalogId);
              if (found) handleAddCard(found);
            }}
            className="rounded-full bg-marigold px-6 py-2.5 text-sm font-semibold text-[#2a1a00] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-opacity"
          >
            + Add Card
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-8 text-center text-sm text-foreground/60">
          Loading your wallet…
        </div>
      ) : cards.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-card px-4 py-10 text-center">
          <p className="font-display text-xl text-mist">Your wallet is empty</p>
          <p className="mt-2 text-sm text-foreground/65 max-w-sm mx-auto">
            Type your card name above (e.g. HDFC Infinia or Axis Atlas) to add it to your wallet.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {cards.map((card) => {
            const cardName = card.card?.name || card.cardId;
            const cardIssuer = card.card?.issuer || "Credit Card";

            return (
              <li key={card.cardId} className="rounded-3xl border border-line bg-card p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl">{cardName}</h2>
                    <p className="text-sm text-foreground/60">{cardIssuer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(card.cardId)}
                    className="text-sm font-medium text-rust hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>Points balance</span>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      placeholder="0"
                      value={card.pointsBalance || ""}
                      onChange={(e) => handlePointsChange(card.cardId, e.target.value)}
                    />
                  </label>
                </div>

                <div className="mt-5 pt-4 border-t border-line/40">
                  <p className={`${labelClass} mb-3`}>Monthly spend (€)</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {categories.map(([key, label]) => {
                      const minorAmount = card.monthlySpendMinor?.[key as keyof typeof card.monthlySpendMinor] || 0;
                      const euroAmount = minorAmount > 0 ? Math.round(minorAmount / 100) : "";

                      return (
                        <label key={key} className="block">
                          <span className="mb-1 block text-xs text-foreground/60">{label}</span>
                          <input
                            className={inputClass}
                            type="number"
                            min="0"
                            placeholder="€ 0"
                            value={euroAmount}
                            onChange={(e) => handleSpendChange(card.cardId, key, e.target.value)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Direct to Plan a Trip button when cards are present */}
      {!loading && cards.length > 0 && (
        <div className="mt-8 rounded-3xl border border-mint/40 bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl text-mint">Wallet Ready</p>
            <p className="text-sm text-foreground/70 mt-1">
              You have {cards.length} {cards.length === 1 ? "card" : "cards"} configured. Proceed to search flights and calculate your savings.
            </p>
          </div>
          <a
            href="/plan"
            className="rounded-full bg-marigold px-8 py-3.5 text-sm font-semibold text-[#2a1a00] hover:opacity-90 transition-opacity shrink-0 text-center"
          >
            Plan a Trip →
          </a>
        </div>
      )}
    </div>
  );
}
