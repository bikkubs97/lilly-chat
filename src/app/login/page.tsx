"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "../_partials/header";
import Footer from "../_partials/footer";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/chat"); // immediate redirect without going back
    }
  }, [router]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      setSuccess("");
      return;
    }

    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setSuccess("");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/chat"); // redirect after login
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setSuccess("");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 text-gray-900">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 bg-white border border-pink-200 p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Login to Lilly
          </h1>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm text-center font-medium">{success}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-pink-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-pink-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button className="w-full bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700 text-white py-2 text-lg rounded-md transition shadow-md">
            Login
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-pink-600 hover:text-blue-600 transition"
            >
              Sign up
            </a>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
