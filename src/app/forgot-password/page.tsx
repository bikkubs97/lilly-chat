"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "../_partials/header";
import Footer from "../_partials/footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setResetLink("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create a reset link.");
        return;
      }

      setSuccess(data.message || "Password reset email sent.");
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-slate-950/95 border border-purple-700 rounded-3xl shadow-2xl shadow-black/30 p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-white">
            Reset your password
          </h1>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center font-medium">
              {success}
            </p>
          )}
          {success && (
            <p className="text-sm text-center text-slate-300">
              If you do not see the email in a minute, check your spam or junk
              folder.
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-purple-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {resetLink && (
            <Link
              href={resetLink}
              className="block break-all rounded-lg border border-fuchsia-300/40 bg-slate-900 p-3 text-sm text-fuchsia-100 transition hover:border-fuchsia-300"
            >
              Open reset link
            </Link>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Creating link..." : "Create reset link"}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Remembered it?{" "}
            <Link
              href="/login"
              className="font-medium text-fuchsia-200 transition-colors hover:text-fuchsia-300"
            >
              Log in
            </Link>
          </p>
        </form>
      </section>

      <Footer />
    </main>
  );
}
