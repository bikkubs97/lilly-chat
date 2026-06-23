"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "../_partials/header";
import Footer from "../_partials/footer";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !token) {
      setError("This reset link is missing required information.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Password and confirmation are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setSuccess(data.message || "Password reset successful.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-slate-950/95 border border-purple-700 rounded-3xl shadow-2xl shadow-black/30 p-8 space-y-6"
    >
      <h1 className="text-3xl font-bold text-center text-white">
        Choose a new password
      </h1>

      {error && (
        <p className="text-red-500 text-sm text-center font-medium">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm text-center font-medium">
          {success}
        </p>
      )}

      <input
        type="password"
        placeholder="New password"
        className="w-full p-3 border border-purple-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm new password"
        className="w-full p-3 border border-purple-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-pink-500 text-white py-2 text-lg rounded-full transition shadow-md hover:cursor-pointer"
      >
        {isSubmitting ? "Saving..." : "Reset password"}
      </Button>

      <p className="text-center text-sm text-gray-400">
        Need a fresh link?{" "}
        <Link
          href="/forgot-password"
          className="font-medium text-white transition hover:text-pink-500"
        >
          Start again
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="text-sm font-medium text-slate-200">
              Loading reset form...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
