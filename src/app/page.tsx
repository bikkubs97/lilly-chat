"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HeartHandshake, MessageCircle, Heart, Zap } from "lucide-react";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import Header from "./_partials/header";
import Footer from "./_partials/footer";
import Link from "next/link";

export default function Homepage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-28 flex flex-col items-center text-center space-y-8 ">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-400/40 via-purple-400/30 to-blue-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute -left-16 top-24 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute right-0 top-36 w-60 h-60 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute left-10 bottom-8 h-28 w-28 rounded-full border border-white/10" />
          <div className="absolute right-20 bottom-20 h-32 w-32 rounded-full border border-fuchsia-300/20" />
        </div>

        {/* Icon */}
        <HeartHandshake className="w-20 h-20 text-fuchsia-400 drop-shadow-md" />

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          <GradientText
            text="Meet Lilly"
            gradient="linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)"
          />
        </h1>

        {/* Flipping Words */}
        <p className="text-2xl md:text-3xl font-medium text-white">
          Lilly is{" "}
          <FlipWords
            words={["Safe", "Secure", "Friendly", "Anonymous", "Understanding"]}
            duration={3000}
            letterDelay={0.05}
            wordDelay={0.1}
          />
        </p>
        <p className="font-bold text-purple-400">
          <span className="text-fuchsia-300">Y</span>our <span className="text-fuchsia-300">L</span>oyal <span className="text-fuchsia-300">L</span>iberal <span className="text-fuchsia-300">I</span>ntelligent <span className="text-fuchsia-300">L</span>istener
        </p>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Chat with empathy, journal your thoughts, and track your emotional journey—all in one safe space.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/chat" className="flex items-center gap-2">
            <Button
              size="lg"
              className="rounded-full shadow-2xl shadow-purple-500/30 px-10 py-6 text-lg bg-purple-600 hover:bg-purple-500 transition-transform hover:scale-105 hover:cursor-pointer"
            >
              <MessageCircle />
              Chat Now
            </Button>
          </Link>
          <Link href={'/signup'}>
            <Button
              size="lg"
              className="rounded-full shadow-2xl shadow-purple-500/25 px-10 py-6 text-lg bg-purple-600 hover:bg-purple-500 transition-transform hover:scale-105 hover:cursor-pointer"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Lilly Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 h-full">
        <div className="space-y-10">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 text-white">Why Lilly?</h3>
            <p className="mx-auto max-w-3xl text-sm sm:text-base text-slate-300">
              Lilly is built to be your quiet companion for emotional support, self-reflection, and personal growth.
              It blends empathetic chat support with private journaling and intelligent mood tracking so you can
              understand yourself better over time.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl text-center">
              <div className="flex items-center justify-center mb-5">
                <MessageCircle className="w-10 h-10 text-fuchsia-300" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Warm Chat Support</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Speak with Lilly anytime, day or night. The chat is designed to feel supportive, nonjudgmental,
                and easy to use—whether you need a quick check-in, a safe place to vent, or helpful emotional guidance.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl text-center">
              <div className="flex items-center justify-center mb-5">
                <Heart className="w-10 h-10 text-fuchsia-300" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Private Journals</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Capture your thoughts, track moments of growth, and revisit your feelings over time.
                Lilly’s journal keeps your entries secure while helping you notice patterns and progress.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl text-center">
              <div className="flex items-center justify-center mb-5">
                <Zap className="w-10 h-10 text-fuchsia-300" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Mood Tracking</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Log how you feel after each chat session and watch your moodboard grow.
                The mood tracker turns your emotions into a visual calendar so you can understand trends and gain insight.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl text-center">
            <h4 className="text-xl font-semibold text-white mb-3">Everything Connected</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Lilly brings together caring conversation, daily reflection, and mood analysis in one place. Your journal entries
              and moodboard work alongside the chat so you can feel supported today while building a clearer emotional picture
              for tomorrow.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
