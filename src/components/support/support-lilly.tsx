"use client";

import React, { useState } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const presetAmounts = [3, 5, 10, 25];

export default function SupportLilly() {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const donationAmount = customAmount ? Number(customAmount) : selectedAmount;

  async function startCheckout() {
    setError("");

    if (!Number.isFinite(donationAmount) || donationAmount < 1) {
      setError("Choose a donation amount of at least $1.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/support/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not start checkout.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative z-10 border-y border-fuchsia-300/10 bg-slate-950/70 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-fuchsia-200">
            <HeartHandshake className="h-8 w-8" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em]">
              Support Lilly
            </p>
          </div>
          <h3 className="text-3xl font-bold text-white md:text-4xl">
            Help keep Lilly warm, private, and available.
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Lilly is free to start using. A voluntary donation helps with hosting,
            AI usage, and the little improvements that make this space feel calmer
            and more useful.
          </p>
          <p className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100">
            Payment page is configured for testing. Use Stripe test cards while
            test keys are active.
          </p>
        </div>

        <div className="rounded-3xl border border-purple-600/60 bg-slate-950/90 p-6 shadow-[0_0_20px_rgba(147,51,234,0.28),0_20px_60px_rgba(15,23,42,0.35)]">
          <div className="grid grid-cols-2 gap-3">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  !customAmount && selectedAmount === amount
                    ? "border-fuchsia-300 bg-fuchsia-400/20 text-white shadow-sm shadow-fuchsia-500/10"
                    : "border-white/10 bg-slate-900 text-slate-200 hover:border-fuchsia-300/50 hover:bg-slate-800"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-300">
            Custom amount
          </label>
          <div className="mt-2 flex items-center rounded-xl border border-purple-700 bg-slate-900 px-3 focus-within:ring-2 focus-within:ring-fuchsia-400">
            <span className="text-slate-400">$</span>
            <input
              type="number"
              min="1"
              max="500"
              step="1"
              inputMode="numeric"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              className="w-full bg-transparent p-3 text-sm text-white outline-none"
              placeholder="Enter amount"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-400">{error}</p>
          )}

          <Button
            type="button"
            disabled={isLoading}
            onClick={startCheckout}
            className="mt-5 w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Opening checkout
              </>
            ) : (
              `Support with $${donationAmount || selectedAmount}`
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
