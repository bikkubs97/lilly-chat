"use client";

import React, { useEffect, useState } from "react";
import Header from "../_partials/header";
import Footer from "../_partials/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface JournalEntry {
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
}

const JOURNAL_PREVIEW_LENGTH = 180;

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState("Your");

  async function fetchEntries() {
    const token = window.localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to access your journal.");
      return;
    }

    try {
      const res = await fetch("/api/journal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setMessage("Unable to load journal entries.");
        return;
      }

      const data = await res.json();
      setEntries(data.journals || []);
    } catch (error) {
      console.error(error);
      setMessage("Could not load journal entries.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!title.trim() || !content.trim()) {
      setMessage("Please add both a title and journal content.");
      return;
    }

    const token = window.localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to save a journal entry.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Unable to save your journal entry.");
        return;
      }

      const data = await res.json();
      setEntries((prev) => [data.journalEntry, ...prev]);
      setTitle("");
      setContent("");
      setMessage("Journal saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not save the journal entry.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const auth = Boolean(token);
    setIsAuthenticated(auth);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])) as { nickname?: string };
        setNickname(payload.nickname || "Your");
      } catch (error) {
        console.error("Invalid token", error);
      }

      fetchEntries();
    }
  }, []);

  const journalsHeading = nickname === "Your" ? "Your Journals" : `${nickname}${nickname.endsWith("s") ? "'" : "'s"} Journals`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white flex flex-col">
      <Header />
      <main className="mx-auto flex-1 w-full max-w-7xl px-6 pb-14 pt-24">
        <div className="flex items-center justify-between gap-4 mb-8">
      <div>
  <h1 className="text-3xl font-bold">Journal</h1>
  <p className="text-sm text-slate-400">Capture your thoughts and feelings anytime.</p>
  <Link href="/chat" className="inline-block mt-3 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500 transition">
    Back to Chat
  </Link>
  </div>
</div>
        {message && (
          <div className="mb-6 rounded-2xl bg-white/5 p-4 text-sm text-slate-100">{message}</div>
        )}

        {isAuthenticated === false ? (
          <div className="rounded-3xl border border-purple-700/30 bg-slate-950/80 p-10 text-center shadow-lg shadow-black/20">
            <h2 className="text-3xl font-semibold text-white mb-4">Login required</h2>
            <p className="mx-auto max-w-xl text-sm text-slate-300 mb-8">
              You should be logged in to write journals and use the mood tracker.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fuchsia-400 transition">
                Login
              </Link>
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="mt-8 mb-10 rounded-3xl bg-slate-950/80 border border-purple-700 p-6 shadow-lg shadow-black/20">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-2">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-purple-700 bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Write a title for this entry"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-2">Entry</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full rounded-2xl border border-purple-700 bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Write about how you feel today..."
                />
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-fuchsia-500 text-white rounded-full px-6 py-3">
                {isSaving ? "Saving..." : "Save Journal"}
              </Button>
            </form>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{journalsHeading}</h2>
              {entries.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-300">
                  No journal entries yet. Use the form above to add your first note.
                </div>
              ) : (
                entries.map((entry) => (
                  <Link
                    key={entry._id ?? entry.title}
                    href={`/journal/${entry._id}`}
                    className="block rounded-3xl border border-purple-700/30 bg-slate-950/80 p-6 shadow-lg shadow-black/20 transition hover:border-fuchsia-400/70 hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  >
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <h2 className="min-w-0 break-words text-xl font-semibold text-white">{entry.title}</h2>
                      <span className="shrink-0 text-sm text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="break-words text-slate-200">
                      {entry.content.slice(0, JOURNAL_PREVIEW_LENGTH)}
                      {entry.content.length > JOURNAL_PREVIEW_LENGTH ? "…" : ""}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-fuchsia-300">Read full entry →</span>
                  </Link>
                ))
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
