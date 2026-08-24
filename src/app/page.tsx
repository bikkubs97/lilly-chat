"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, HeartHandshake, LockKeyhole, MessageCircle, Mic, Zap } from "lucide-react";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import Header from "./_partials/header";
import Footer from "./_partials/footer";
import Link from "next/link";
import LillyNeuralNetwork from "@/components/illustrations/lilly-neural-network";
import SupportLilly from "@/components/support/support-lilly";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(window.localStorage.getItem("token")));
  }, []);

  return (
    <main className="app-background relative min-h-screen overflow-hidden text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center space-y-7 px-6 pb-24 pt-32 text-center sm:pt-36">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute left-1/2 top-16 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-fuchsia-500/8 blur-3xl" />
          <div className="absolute right-0 top-36 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <span className="eyebrow"><LockKeyhole className="mr-2 size-3.5" />A private space to check in</span>

        <div className="flex size-14 items-center justify-center rounded-2xl border border-fuchsia-200/15 bg-fuchsia-400/10 shadow-lg shadow-fuchsia-950/20">
          <HeartHandshake className="size-7 text-fuchsia-300" aria-hidden="true" />
        </div>

        {/* Title */}
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-6xl md:text-7xl">
          <GradientText
            text="Meet Lilly"
            gradient="linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)"
          />
        </h1>

        <p className="text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl">
          Lilly is{" "}
          <FlipWords
            words={["Safe", "Secure", "Friendly", "Anonymous", "Understanding"]}
            duration={3000}
            letterDelay={0.05}
            wordDelay={0.1}
          />
        </p>
        <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Chat with empathy, journal your thoughts, and track your emotional journey—all in one safe space. You don&apos;t have to create an account to start chatting.
        </p>

        <div className="glass-surface inline-flex max-w-xl items-center gap-3 rounded-2xl px-4 py-3 text-left">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-200">
            <Mic className="size-4" aria-hidden="true" />
          </span>
          <p className="text-sm leading-5 text-slate-200">
            <span className="font-semibold text-white">Voice chat is here.</span> Talk to Lilly naturally, and she&apos;ll respond out loud.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="px-8">
            <Link href="/chat">
              <MessageCircle />
              Start a conversation <ArrowRight />
            </Link>
          </Button>
          {!isLoggedIn && (
          <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/signup">
                Sign Up
              </Link>
            </Button>
          )}
        </div>
        <p className="text-sm text-slate-400">Here whenever you need a moment to reflect.</p>

        <div className="pointer-events-none absolute -bottom-10 -z-10 w-full max-w-3xl opacity-80 sm:block">
          <LillyNeuralNetwork />
        </div>
      </section>

      {/* Why Lilly Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="space-y-10">
          <div className="text-center">
            <span className="eyebrow">Made for the everyday</span>
            <h3 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-4xl">Support that meets you where you are.</h3>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Lilly is built to be your quiet companion for emotional support, self-reflection, and personal growth.
              It blends empathetic chat support with private journaling and intelligent mood tracking so you can
              understand yourself better over time.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <ScrollReveal className="glass-surface rounded-3xl p-7 text-left">
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-fuchsia-400/10 ring-1 ring-inset ring-fuchsia-200/15">
                <MessageCircle className="size-5 text-fuchsia-200" />
              </div>
              <h4 className="mb-2 text-xl font-semibold tracking-[-0.02em] text-white">Warm Chat Support</h4>
              <p className="text-sm leading-6 text-slate-300">
                Type or talk with Lilly anytime, day or night. Voice chat lets you speak naturally and hear Lilly&apos;s response. The chat is designed to feel supportive, nonjudgmental,
                and easy to use—whether you need a quick check-in, a safe place to vent, or helpful emotional guidance.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className="glass-surface rounded-3xl p-7 text-left">
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-fuchsia-400/10 ring-1 ring-inset ring-fuchsia-200/15">
                <Heart className="size-5 text-fuchsia-200" />
              </div>
              <h4 className="mb-2 text-xl font-semibold tracking-[-0.02em] text-white">Private Journals</h4>
              <p className="text-sm leading-6 text-slate-300">
                Capture your thoughts, track moments of growth, and revisit your feelings over time.
                Lilly&apos;s journal keeps your entries secure while helping you notice patterns and progress.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16} className="glass-surface rounded-3xl p-7 text-left">
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-fuchsia-400/10 ring-1 ring-inset ring-fuchsia-200/15">
                <Zap className="size-5 text-fuchsia-200" />
              </div>
              <h4 className="mb-2 text-xl font-semibold tracking-[-0.02em] text-white">Mood Tracking</h4>
              <p className="text-sm leading-6 text-slate-300">
                Log how you feel after each chat session and watch your moodboard grow.
                The mood tracker turns your emotions into a visual calendar so you can understand trends and gain insight.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal className="glass-surface-strong rounded-3xl p-8 text-center sm:p-10">
            <h4 className="mb-3 text-xl font-semibold tracking-[-0.02em] text-white">Everything Connected</h4>
            <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-300">
              Lilly brings together caring conversation, daily reflection, and mood analysis in one place. Your journal entries
              and moodboard work alongside the chat so you can feel supported today while building a clearer emotional picture
              for tomorrow.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div id="support-lilly">
        <SupportLilly />
      </div>

      <Footer />
    </main>
  );
}
