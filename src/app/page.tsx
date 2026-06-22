"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Zap } from "lucide-react";
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
      <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-28 flex flex-col items-center text-center space-y-8">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-400/40 via-purple-400/30 to-blue-400/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute -left-16 top-24 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute right-0 top-36 w-60 h-60 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute left-10 bottom-8 h-28 w-28 rounded-full border border-white/10" />
          <div className="absolute right-20 bottom-20 h-32 w-32 rounded-full border border-fuchsia-300/20" />
        </div>

        {/* Hero Neuron SVG — HeartHandshake icon lives inside */}
        <div className="w-full max-w-2xl mx-auto -my-2">
          <svg
            width="100%"
            viewBox="0 0 680 340"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Animated neural network with a heart handshake icon at the center"
          >
            <defs>
              <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e879f9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
              </radialGradient>
              <filter id="pulse-glow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Motion paths */}
              <path id="path-lt" d="M178,100 L310,160" />
              <path id="path-lm" d="M150,200 L310,185" />
              <path id="path-lb" d="M200,278 L315,210" />
              <path id="path-tl" d="M290,82  L330,148" />
              <path id="path-tr" d="M390,82  L350,148" />
              <path id="path-rt" d="M480,100 L370,160" />
              <path id="path-rm" d="M530,200 L370,185" />
              <path id="path-rb" d="M480,278 L365,210" />
              <path id="path-bt" d="M340,290 L340,222" />
            </defs>

            {/* Ambient glows */}
            <ellipse cx="340" cy="170" rx="220" ry="170" fill="url(#glow1)" />
            <ellipse cx="340" cy="165" rx="110" ry="90" fill="url(#glow2)" />

            {/* ── Outer neuron nodes ── */}
            <circle cx="108" cy="130" r="7"  fill="#7c3aed" opacity="0.85" />
            <circle cx="68"  cy="190" r="5"  fill="#6d28d9" opacity="0.7"  />
            <circle cx="118" cy="240" r="6"  fill="#7c3aed" opacity="0.75" />
            <circle cx="230" cy="54"  r="6"  fill="#c026d3" opacity="0.8"  />
            <circle cx="340" cy="36"  r="7"  fill="#e879f9" opacity="0.85" />
            <circle cx="450" cy="54"  r="6"  fill="#c026d3" opacity="0.8"  />
            <circle cx="572" cy="130" r="7"  fill="#7c3aed" opacity="0.85" />
            <circle cx="612" cy="190" r="5"  fill="#6d28d9" opacity="0.7"  />
            <circle cx="562" cy="240" r="6"  fill="#7c3aed" opacity="0.75" />
            <circle cx="230" cy="296" r="6"  fill="#818cf8" opacity="0.75" />
            <circle cx="340" cy="312" r="7"  fill="#818cf8" opacity="0.8"  />
            <circle cx="450" cy="296" r="6"  fill="#818cf8" opacity="0.75" />

            {/* ── Mid-ring neuron nodes ── */}
            <circle cx="178" cy="100" r="9"  fill="#9333ea" opacity="0.9"  />
            <circle cx="150" cy="200" r="8"  fill="#7c3aed" opacity="0.85" />
            <circle cx="200" cy="278" r="8"  fill="#6d28d9" opacity="0.8"  />
            <circle cx="290" cy="82"  r="8"  fill="#d946ef" opacity="0.9"  />
            <circle cx="390" cy="82"  r="8"  fill="#d946ef" opacity="0.9"  />
            <circle cx="480" cy="100" r="9"  fill="#9333ea" opacity="0.9"  />
            <circle cx="530" cy="200" r="8"  fill="#7c3aed" opacity="0.85" />
            <circle cx="480" cy="278" r="8"  fill="#6d28d9" opacity="0.8"  />
            <circle cx="340" cy="290" r="8"  fill="#818cf8" opacity="0.85" />

            {/* ── Axon lines ── */}
            <line x1="178" y1="100" x2="310" y2="160" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
            <line x1="150" y1="200" x2="310" y2="185" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
            <line x1="200" y1="278" x2="315" y2="210" stroke="#6d28d9" strokeWidth="0.8" opacity="0.2"  />
            <line x1="480" y1="100" x2="370" y2="160" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
            <line x1="530" y1="200" x2="370" y2="185" stroke="#7c3aed" strokeWidth="0.8" opacity="0.25" />
            <line x1="480" y1="278" x2="365" y2="210" stroke="#6d28d9" strokeWidth="0.8" opacity="0.2"  />
            <line x1="290" y1="82"  x2="330" y2="148" stroke="#d946ef" strokeWidth="0.8" opacity="0.25" />
            <line x1="390" y1="82"  x2="350" y2="148" stroke="#d946ef" strokeWidth="0.8" opacity="0.25" />
            <line x1="340" y1="290" x2="340" y2="222" stroke="#818cf8" strokeWidth="0.8" opacity="0.2"  />
            <line x1="108" y1="130" x2="178" y2="100" stroke="#6d28d9" strokeWidth="0.6" opacity="0.2"  />
            <line x1="68"  y1="190" x2="150" y2="200" stroke="#6d28d9" strokeWidth="0.6" opacity="0.18" />
            <line x1="118" y1="240" x2="200" y2="278" stroke="#6d28d9" strokeWidth="0.6" opacity="0.18" />
            <line x1="572" y1="130" x2="480" y2="100" stroke="#6d28d9" strokeWidth="0.6" opacity="0.2"  />
            <line x1="612" y1="190" x2="530" y2="200" stroke="#6d28d9" strokeWidth="0.6" opacity="0.18" />
            <line x1="562" y1="240" x2="480" y2="278" stroke="#6d28d9" strokeWidth="0.6" opacity="0.18" />
            <line x1="230" y1="54"  x2="290" y2="82"  stroke="#c026d3" strokeWidth="0.6" opacity="0.2"  />
            <line x1="340" y1="36"  x2="340" y2="82"  stroke="#e879f9" strokeWidth="0.6" opacity="0.2"  />
            <line x1="450" y1="54"  x2="390" y2="82"  stroke="#c026d3" strokeWidth="0.6" opacity="0.2"  />
            <line x1="230" y1="296" x2="340" y2="290" stroke="#818cf8" strokeWidth="0.6" opacity="0.18" />
            <line x1="450" y1="296" x2="340" y2="290" stroke="#818cf8" strokeWidth="0.6" opacity="0.18" />

            {/* ── Firing pulses ── */}
            <circle r="3" fill="#e879f9" opacity="0.95" filter="url(#pulse-glow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#path-lt" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.2s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle r="3" fill="#c084fc" opacity="0.95" filter="url(#pulse-glow)">
              <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.7s"><mpath href="#path-lm" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.6s" repeatCount="indefinite" begin="0.7s" />
            </circle>
            <circle r="2.5" fill="#818cf8" opacity="0.9" filter="url(#pulse-glow)">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="1.4s"><mpath href="#path-lb" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.4s" repeatCount="indefinite" begin="1.4s" />
            </circle>
            <circle r="3" fill="#f0abfc" opacity="0.95" filter="url(#pulse-glow)">
              <animateMotion dur="2s" repeatCount="indefinite" begin="0.3s"><mpath href="#path-tl" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2s" repeatCount="indefinite" begin="0.3s" />
            </circle>
            <circle r="3" fill="#f0abfc" opacity="0.95" filter="url(#pulse-glow)">
              <animateMotion dur="2s" repeatCount="indefinite" begin="1.1s"><mpath href="#path-tr" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2s" repeatCount="indefinite" begin="1.1s" />
            </circle>
            <circle r="3" fill="#e879f9" opacity="0.95" filter="url(#pulse-glow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.5s"><mpath href="#path-rt" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.2s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle r="3" fill="#c084fc" opacity="0.95" filter="url(#pulse-glow)">
              <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.2s"><mpath href="#path-rm" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.6s" repeatCount="indefinite" begin="1.2s" />
            </circle>
            <circle r="2.5" fill="#818cf8" opacity="0.9" filter="url(#pulse-glow)">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="1.9s"><mpath href="#path-rb" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.4s" repeatCount="indefinite" begin="1.9s" />
            </circle>
            <circle r="3" fill="#818cf8" opacity="0.9" filter="url(#pulse-glow)">
              <animateMotion dur="2.1s" repeatCount="indefinite" begin="0.9s"><mpath href="#path-bt" /></animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.1s" repeatCount="indefinite" begin="0.9s" />
            </circle>

            {/* ── Synapse burst rings at center ── */}
            <circle cx="340" cy="185" r="28" fill="none" stroke="#e879f9" strokeWidth="1" opacity="0">
              <animate attributeName="r" values="28;52;28" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.35;0" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="340" cy="185" r="20" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0">
              <animate attributeName="r" values="20;44;20" dur="2.6s" repeatCount="indefinite" begin="0.4s" />
              <animate attributeName="opacity" values="0;0.3;0" dur="2.6s" repeatCount="indefinite" begin="0.4s" />
            </circle>

            {/* ── HeartHandshake icon centered ── */}
            <g
              transform="translate(315, 160) scale(2)"
              stroke="#e879f9"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
              <path d="m18 15-2-2" />
              <path d="m15 18-2-2" />
            </g>

            {/* ── Chat bubble LEFT ── */}
            <g opacity="0">
              <animate attributeName="opacity" values="0;1;1;0" dur="6s" repeatCount="indefinite" begin="0.5s" />
              {/* Bubble body */}
              <rect x="28" y="108" width="148" height="54" rx="14" fill="#1e1b4b" stroke="#6d28d9" strokeWidth="0.8" />
              {/* Tail */}
              <polygon points="56,162 40,180 72,162" fill="#1e1b4b" stroke="#6d28d9" strokeWidth="0.8" />
              {/* Text lines */}
              <rect x="44" y="121" width="50" height="6" rx="3" fill="#a78bfa" opacity="0.7" />
              <rect x="44" y="133" width="96" height="6" rx="3" fill="#7c3aed" opacity="0.45" />
              <rect x="44" y="145" width="72" height="6" rx="3" fill="#7c3aed" opacity="0.3" />
            </g>

            {/* ── Chat bubble RIGHT ── */}
            <g opacity="0">
              <animate attributeName="opacity" values="0;0;1;1;0" dur="6s" repeatCount="indefinite" begin="2.5s" />
              {/* Bubble body */}
              <rect x="504" y="108" width="148" height="54" rx="14" fill="#2e1065" stroke="#c026d3" strokeWidth="0.8" />
              {/* Tail */}
              <polygon points="612,162 628,180 596,162" fill="#2e1065" stroke="#c026d3" strokeWidth="0.8" />
              {/* Text lines */}
              <rect x="520" y="121" width="96" height="6" rx="3" fill="#e879f9" opacity="0.7" />
              <rect x="520" y="133" width="72" height="6" rx="3" fill="#a21caf" opacity="0.45" />
              <rect x="520" y="145" width="50" height="6" rx="3" fill="#a21caf" opacity="0.3" />
            </g>

            {/* ── Sparkle dots ── */}
            <circle cx="148" cy="155" r="2"   fill="#e879f9" opacity="0.45" />
            <circle cx="535" cy="158" r="2"   fill="#818cf8" opacity="0.45" />
            <circle cx="310" cy="46"  r="1.8" fill="#e879f9" opacity="0.4"  />
            <circle cx="375" cy="308" r="1.5" fill="#a855f7" opacity="0.4"  />
            <circle cx="170" cy="248" r="1.5" fill="#c084fc" opacity="0.35" />
            <circle cx="510" cy="248" r="1.5" fill="#c084fc" opacity="0.35" />
            <circle cx="262" cy="308" r="1.5" fill="#818cf8" opacity="0.35" />

            {/* ── Node halo pulses on mid-ring ── */}
            <circle cx="178" cy="100" r="9" fill="none" stroke="#9333ea" strokeWidth="1" opacity="0">
              <animate attributeName="r" values="9;16;9"   dur="3s"   repeatCount="indefinite" begin="0s"   />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="3s"   repeatCount="indefinite" begin="0s"   />
            </circle>
            <circle cx="480" cy="100" r="9" fill="none" stroke="#9333ea" strokeWidth="1" opacity="0">
              <animate attributeName="r" values="9;16;9"   dur="3s"   repeatCount="indefinite" begin="1.5s" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="3s"   repeatCount="indefinite" begin="1.5s" />
            </circle>
            <circle cx="290" cy="82"  r="8" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0">
              <animate attributeName="r" values="8;15;8"   dur="2.8s" repeatCount="indefinite" begin="0.6s" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2.8s" repeatCount="indefinite" begin="0.6s" />
            </circle>
            <circle cx="390" cy="82"  r="8" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0">
              <animate attributeName="r" values="8;15;8"   dur="2.8s" repeatCount="indefinite" begin="1.8s" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2.8s" repeatCount="indefinite" begin="1.8s" />
            </circle>
          </svg>
        </div>

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
          <span className="text-fuchsia-300">Y</span>our{" "}
          <span className="text-fuchsia-300">L</span>oyal{" "}
          <span className="text-fuchsia-300">L</span>iberal{" "}
          <span className="text-fuchsia-300">I</span>ntelligent{" "}
          <span className="text-fuchsia-300">L</span>istener
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
          <Link href="/signup">
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
            <div className="rounded-3xl border border-purple-600/60 bg-slate-950/80 p-8 text-center shadow-[0_0_20px_rgba(147,51,234,0.3),0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-300 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5),0_20px_60px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-center mb-5">
                <MessageCircle className="w-10 h-10 text-fuchsia-300" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Warm Chat Support</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Speak with Lilly anytime, day or night. The chat is designed to feel supportive, nonjudgmental,
                and easy to use—whether you need a quick check-in, a safe place to vent, or helpful emotional guidance.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-600/60 bg-slate-950/80 p-8 text-center shadow-[0_0_20px_rgba(147,51,234,0.3),0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-300 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5),0_20px_60px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-center mb-5">
                <Heart className="w-10 h-10 text-fuchsia-300" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Private Journals</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Capture your thoughts, track moments of growth, and revisit your feelings over time.
                Lilly's journal keeps your entries secure while helping you notice patterns and progress.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-600/60 bg-slate-950/80 p-8 text-center shadow-[0_0_20px_rgba(147,51,234,0.3),0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-300 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5),0_20px_60px_rgba(15,23,42,0.45)]">
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

          <div className="rounded-3xl border border-purple-600/60 bg-slate-950/80 p-8 text-center shadow-[0_0_20px_rgba(147,51,234,0.3),0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-300 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5),0_20px_60px_rgba(15,23,42,0.45)]">
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
