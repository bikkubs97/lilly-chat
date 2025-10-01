"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HeartHandshake, MessageCircle, Heart, Shield, Zap } from "lucide-react";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import Header from "./_partials/header";
import Footer from "./_partials/footer";
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background";
import Link from "next/link";

export default function Homepage() {
  const features = [
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "AI that understands your emotions and responds with care",
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are confidential and secure",
    },
    {
      icon: Zap,
      title: "Always Available",
      description: "24/7 support whenever you need someone to talk to",
    },
  ];

  return (
    <main className=" text-gray-900 relative overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground className="absolute inset-0 " />

      <Header />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-28 flex flex-col items-center text-center space-y-8">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center -z-20">
          <div className="w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-400/40 via-purple-400/30 to-blue-400/20 blur-3xl rounded-full animate-pulse" />
        </div>

        {/* Tagline */}
        <h3 className="text-lg md:text-xl font-semibold tracking-wide text-purple-700 drop-shadow-sm">
          Your AI Mental Health Companion
        </h3>

        {/* Icon */}
        <HeartHandshake className="w-20 h-20 text-pink-500 drop-shadow-md" />

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          <GradientText
            text="Meet Lilly"
            gradient="linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)"
          />
        </h1>

        {/* Flipping Words */}
        <p className="text-2xl md:text-3xl font-medium text-gray-700">
          Lilly is{" "}
          <FlipWords
            words={["Safe", "Secure", "Friendly", "Anonymous", "Understanding"]}
            duration={3000}
            letterDelay={0.05}
            wordDelay={0.1}
          />
        </p>
        <p className="font-bold">Chat Without creating an Account</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/chat" className="flex items-center gap-2 ">
            <Button
              size="lg"
              className="rounded-full shadow-lg px-10 py-6 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-transform hover:cursor-pointer"
            >
              <MessageCircle />
              Chat Now
            </Button>
          </Link>
          <Link href={'/signup'}>
            <Button
              size="lg"
              className="rounded-full shadow-lg px-10 py-6 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-transform hover:cursor-pointer"
            >

              Sign Up
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Lilly Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10 h-full">
        <h3 className="text-3xl font-bold text-center mb-12">Why Lilly?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="text-center p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform bg-white/60 backdrop-blur-md"
              >
                <CardHeader>
                  <Icon className="w-10 h-10 mx-auto mb-4 text-pink-600" />
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>



      <Footer />
    </main>
  );
}
