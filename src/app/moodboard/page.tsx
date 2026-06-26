"use client";

import React, { useEffect, useState } from "react";
import Header from "../_partials/header";
import Footer from "../_partials/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MoodEntry {
  _id?: string;
  date: string;
  mood: string;
  emotion: string;
  note: string;
}

const moodColors = [
  { keywords: ["suicidal", "extreme", "crisis", "hopeless", "danger"], className: "bg-red-500/10 border-red-500 text-red-200" },
  { keywords: ["anxious", "anxiety", "panic", "worried", "nervous", "fear"], className: "bg-amber-500/10 border-amber-500 text-amber-200" },
  { keywords: ["stressed", "stress", "overwhelmed", "burnout", "exhausted", "tired"], className: "bg-orange-500/10 border-orange-500 text-orange-200" },
  { keywords: ["angry", "anger", "frustrated", "irritated", "resentful"], className: "bg-rose-500/10 border-rose-500 text-rose-200" },
  { keywords: ["lonely", "alone", "isolated", "empty"], className: "bg-indigo-500/10 border-indigo-500 text-indigo-200" },
  { keywords: ["depression", "depressed", "depressing", "sadness"], className: "bg-blue-500/10 border-blue-500 text-blue-200" },
  { keywords: ["sad", "blue", "gloomy"], className: "bg-blue-500/10 border-blue-500 text-blue-200" },
  { keywords: ["happy", "joy", "good", "cheerful", "content", "hopeful", "grateful"], className: "bg-emerald-500/10 border-emerald-500 text-emerald-200" },
  { keywords: ["calm", "neutral", "relaxed", "okay"], className: "bg-slate-500/10 border-slate-500 text-slate-200" },
];

function getMoodClass(mood: string) {
  const normalized = mood.toLowerCase();
  const match = moodColors.find((group) =>
    group.keywords.some((keyword) => normalized.includes(keyword))
  );
  return match?.className || "bg-violet-500/10 border-violet-500 text-violet-200";
}

function getMoodBadgeText(mood: string) {
  const normalized = mood.toLowerCase();
  if (normalized.includes("suicid") || normalized.includes("extreme") || normalized.includes("danger") || normalized.includes("hopeless")) {
    return "Critical";
  }
  if (normalized.includes("anx") || normalized.includes("panic") || normalized.includes("worried") || normalized.includes("nervous")) {
    return "Anxious";
  }
  if (normalized.includes("stress") || normalized.includes("overwhelm") || normalized.includes("burnout") || normalized.includes("exhaust")) {
    return "Stressed";
  }
  if (normalized.includes("angry") || normalized.includes("anger") || normalized.includes("frustrat") || normalized.includes("irritat")) {
    return "Angry";
  }
  if (normalized.includes("lonely") || normalized.includes("alone") || normalized.includes("isolat") || normalized.includes("empty")) {
    return "Lonely";
  }
  if (normalized.includes("sad") || normalized.includes("blue") || normalized.includes("depress")) {
    return "Low";
  }
  if (normalized.includes("happy") || normalized.includes("joy") || normalized.includes("good") || normalized.includes("content") || normalized.includes("hopeful") || normalized.includes("grateful")) {
    return "High";
  }
  if (normalized.includes("calm") || normalized.includes("neutral") || normalized.includes("relaxed")) {
    return "Stable";
  }
  return "Balanced";
}

function getLocalDateKey(date: string | Date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildCalendarEntries(entries: MoodEntry[]) {
  return entries.reduce<Record<string, MoodEntry[]>>((acc, entry) => {
    const dateKey = getLocalDateKey(entry.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startIndex = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day?: number; dateKey?: string }> = [];

  for (let i = 0; i < startIndex; i++) {
    cells.push({});
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ day, dateKey: getLocalDateKey(date) });
  }

  while (cells.length % 7 !== 0) {
    cells.push({});
  }

  return cells;
}

export default function MoodboardPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [message, setMessage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("You");
  const [calendarMap, setCalendarMap] = useState<Record<string, MoodEntry[]>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date());

  async function fetchMoodboard() {
    const token = window.localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to view your moodboard.");
      return;
    }

    try {
      const res = await fetch("/api/moodboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Unable to load moodboard.");
        return;
      }

      const data = await res.json();
      const moodboard = [...(data.moodboard || [])].sort(
        (a: MoodEntry, b: MoodEntry) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(moodboard);
      setCalendarMap(buildCalendarEntries(moodboard));
    } catch (error) {
      console.error(error);
      setMessage("Could not load moodboard.");
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const auth = Boolean(token);
    setIsAuthenticated(auth);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setNickname(payload.nickname || "You");
      } catch (err) {
        console.error("Invalid token", err);
      }

      fetchMoodboard();
    }
  }, []);

  const monthDays = getMonthDays(displayedMonth.getFullYear(), displayedMonth.getMonth());
  const monthLabel = displayedMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  function changeMonth(offset: number) {
    setDisplayedMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-24 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{nickname}&apos;s Moodboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Visualize your mood trends and session notes over time. Colored moods highlight the emotional tone at a glance.
            </p>
          </div>
          <Button asChild>
            <Link href="/chat">Back to Chat</Link>
          </Button>
        </div>

        {message && (
          <div className="mb-6 rounded-3xl bg-white/5 p-4 text-sm text-slate-100">{message}</div>
        )}

        {isAuthenticated === false ? (
          <div className="mb-10 rounded-4xl border border-white/10 bg-slate-950/80 p-10 text-center shadow-xl shadow-black/20">
            <h2 className="text-3xl font-semibold text-white mb-4">Login required</h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-300 mb-8">
              You should be logged in to use the mood tracker and save mood entries.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <section className="mb-10 overflow-hidden rounded-4xl border border-white/10 bg-slate-950/80 p-3 shadow-xl shadow-black/20 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Mood Calendar</h2>
                  <p className="text-sm text-slate-400">Today&apos;s mood is shown on the calendar. Hover over or check entries below for details.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm sm:flex sm:flex-wrap">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">Happy</span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-200">Sad</span>
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-200">Critical</span>
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-200">Other</span>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between gap-2">
                <Button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" variant="secondary" size="icon">
                  ←
                </Button>
                <h3 className="text-center text-base font-semibold text-white sm:text-lg">{monthLabel}</h3>
                <Button type="button" onClick={() => changeMonth(1)} aria-label="Next month" variant="secondary" size="icon">
                  →
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-400 sm:gap-3 sm:text-xs">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((weekday) => (
                  <div key={weekday} className="text-center font-medium">{weekday}</div>
                ))}
              </div>

              <div className="mt-1 grid grid-cols-7 gap-1 sm:mt-3 sm:gap-3">
                {monthDays.map((cell, index) => {
                  const entriesForDay = cell.dateKey ? calendarMap[cell.dateKey] || [] : [];
                  const highlightMood = entriesForDay[0]?.mood || "";
                  const badgeClass = cell.dateKey ? getMoodClass(highlightMood) : "bg-transparent";

                  return (
                    <div
                      key={`${cell.dateKey ?? 'empty'}-${index}`}
                      className={`min-w-0 min-h-[52px] rounded-xl border border-white/10 p-1 text-sm sm:min-h-[82px] sm:rounded-3xl sm:p-3 ${cell.day ? "bg-slate-900/80" : "bg-transparent"}`}
                    >
                      {cell.day ? (
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white sm:text-base">{cell.day}</span>
                            {entriesForDay.length > 0 && (
                              <>
                                <span aria-label={getMoodBadgeText(highlightMood)} className={`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border px-1 text-[10px] font-semibold sm:hidden ${badgeClass}`}>
                                  {entriesForDay.length}
                                </span>
                                <span className={`hidden items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold sm:inline-flex ${badgeClass}`}>
                                  {entriesForDay.length > 1 ? `${entriesForDay.length} moods` : getMoodBadgeText(highlightMood)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-2 hidden space-y-1 sm:block">
                            {entriesForDay.map((entry) => (
                              <div key={entry._id ?? `${entry.date}-${entry.mood}-${entry.emotion}`} className="rounded-2xl bg-white/5 px-2 py-1 text-[11px] text-slate-200">
                                {entry.mood}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              {entries.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-300">
                  No moodboard entries yet. End a chat session to save your mood.
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry._id ?? entry.date} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-lg shadow-black/20">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                        <h2 className="text-2xl font-semibold text-white">{nickname}&apos;s mood: <span className={getMoodClass(entry.mood)}>{entry.mood}</span></h2>
                        <p className="mt-2 text-sm text-slate-300">Emotion: {entry.emotion}</p>
                      </div>
                      <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-200">
                        {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <p className="mt-4 text-slate-200 whitespace-pre-line">{entry.note}</p>
                  </div>
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
