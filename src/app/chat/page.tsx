"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, LockKeyhole, Mic, Pause, Send, Square, Volume2 } from "lucide-react";
import Header from "../_partials/header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "assistant" | "user" | "system";
  content: string;
}

const CHAT_SESSION_STORAGE_KEY = "lilly.chatSessionMessages";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `You are Lilly, a warm and calm presence — like a trusted friend. Never mention ChatGPT or AI. Always say your name is Lilly. Respond only to emotional wellness topics in a gentle, caring way. Use soft, warm, casual language with emojis.`,
    },
    { role: "assistant", content: "Hi there! How can I support you today? 🌸" },
  ]);

  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [contextStatus, setContextStatus] = useState<string>("");

  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [typingLines, setTypingLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
  const [loadingSpeechIndex, setLoadingSpeechIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speechRequestIdRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Scroll to bottom when messages or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1;
      audioRef.current?.pause();
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const hasUserMessages = messages.some((message) => message.role === "user");

    if (hasUserMessages) {
      window.localStorage.setItem(CHAT_SESSION_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  function formatText(text: string) {
    if (!text) return "";
    return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
  }

  async function handleSendMessage(messageText?: string, speakReply = false) {
    const trimmed = (messageText ?? input).trim();
    if (!trimmed || isThinking) return;

    const token = window.localStorage.getItem("token");

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setContextStatus("");
    inputRef.current?.focus();
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (response.status === 401 && token) {
        window.localStorage.removeItem("token");
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: { reply?: string; usedJournalContext?: boolean; usedMoodContext?: boolean } = await response.json();
      const reply = formatText(data.reply || "Sorry, I couldn't get a response.");
      if (data.usedJournalContext || data.usedMoodContext) {
        const sources = [data.usedJournalContext && "journal", data.usedMoodContext && "recent moods"].filter(Boolean).join(" and ");
        setContextStatus(`Using your ${sources} as private context`);
      }

      // Add assistant placeholder
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const assistantIndex = newMessages.length;

      const lines = reply.split("\n"); // split by lines
      setTypingIndex(assistantIndex);
      setTypingLines(lines);
      setCurrentLine(0);
      if (speakReply) void handleSpeech(assistantIndex, reply);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  // Animate line by line typing
  useEffect(() => {
    if (typingIndex === null) return;
    if (currentLine >= typingLines.length) {
      // Update final message
      setMessages((prev) => {
        const updated = [...prev];
        updated[typingIndex].content = typingLines.join("\n");
        return updated;
      });
      setTypingIndex(null);
      setTypingLines([]);
      setCurrentLine(0);
      return;
    }

    const timeout = setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[typingIndex].content = typingLines.slice(0, currentLine + 1).join("\n");
        return updated;
      });
      setCurrentLine((prev) => prev + 1);
    }, 50); // adjust speed per line

    return () => clearTimeout(timeout);
  }, [typingIndex, currentLine, typingLines]);

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  async function handleSpeech(messageIndex: number, content: string) {
    if (!content.trim()) return;

    if (playingMessageIndex === messageIndex && audioRef.current) {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setPlayingMessageIndex(messageIndex);
      } else {
        audioRef.current.pause();
        setPlayingMessageIndex(null);
      }
      return;
    }

    const requestId = speechRequestIdRef.current + 1;
    speechRequestIdRef.current = requestId;
    audioRef.current?.pause();
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setLoadingSpeechIndex(messageIndex);
    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });
      if (!response.ok) throw new Error("Unable to generate speech");

      const audioUrl = URL.createObjectURL(await response.blob());
      if (speechRequestIdRef.current !== requestId) {
        URL.revokeObjectURL(audioUrl);
        return;
      }
      audioUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setPlayingMessageIndex(null);
      audio.onpause = () => setPlayingMessageIndex((current) => current === messageIndex ? null : current);
      await audio.play();
      setPlayingMessageIndex(messageIndex);
    } catch (error) {
      console.error("Speech playback error:", error);
      setPlayingMessageIndex(null);
    } finally {
      setLoadingSpeechIndex((current) => current === messageIndex ? null : current);
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setVoiceError("Voice chat is not supported in this browser.");
      return;
    }

    setVoiceError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        setIsRecording(false);

        const recording = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (!recording.size) return;

        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", recording, "lilly-voice-message.webm");
          const response = await fetch("/api/transcribe", { method: "POST", body: formData });
          const data: { transcript?: string; error?: string } = await response.json();
          if (!response.ok) throw new Error(data.error || "Unable to transcribe audio");
          if (!data.transcript?.trim()) {
            setVoiceError("I couldn't hear anything. Please try again.");
            return;
          }
          await handleSendMessage(data.transcript, true);
        } catch (error) {
          console.error("Voice chat error:", error);
          setVoiceError("I couldn't process that recording. Please try again.");
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      setVoiceError("Please allow microphone access to talk with Lilly.");
    }
  }

  function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }
    void startRecording();
  }

  return (
    <div className="app-background flex min-h-screen flex-col pt-24 text-slate-100">
      <Header />

     

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32 sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)]">
            <section className="space-y-5">
            <div className="glass-surface flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-white">
                  Chat with Lilly
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-fuchsia-100"><Mic className="size-3.5" />Voice chat available</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-300"><LockKeyhole className="size-3.5 text-fuchsia-200" />Your conversation stays private.</span>
                {contextStatus && (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                    {contextStatus}
                  </span>
                )}
              </div>
            </div>

            {messages.map((msg, index) => {
              if (msg.role === "system") return null;

              return (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                    msg.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-950/30"
                      : "glass-surface rounded-bl-md text-slate-100"
                  }`}>
                    {msg.role === "assistant" ? (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                        {msg.content && (
                          <button
                            type="button"
                            onClick={() => handleSpeech(index, msg.content)}
                            disabled={loadingSpeechIndex === index}
                            aria-label={playingMessageIndex === index ? "Pause Lilly's reply" : "Listen to Lilly's reply"}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-fuchsia-100 transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
                          >
                            {loadingSpeechIndex === index ? (
                              <LoaderCircle className="size-3.5 animate-spin" />
                            ) : playingMessageIndex === index ? (
                              <Pause className="size-3.5" />
                            ) : (
                              <Volume2 className="size-3.5" />
                            )}
                            {loadingSpeechIndex === index ? "Preparing…" : playingMessageIndex === index ? "Pause" : "Listen"}
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="whitespace-pre-line">{msg.content}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="glass-surface flex rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300" />
                  </span>
                </div>
                <span className="text-xs">Lilly is thinking… 🌸</span>
              </div>
            )}

            <div ref={messagesEndRef} />
            </section>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        <div className="glass-surface-strong mx-auto flex max-w-4xl items-end gap-3 rounded-3xl p-2">
        {isRecording ? (
          <div className="flex min-h-[48px] flex-1 items-center gap-3 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3" role="status" aria-label="Recording voice message">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-300 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-rose-300" />
            </span>
            <div className="flex h-7 flex-1 items-center justify-center gap-1" aria-hidden="true">
              {[15, 24, 18, 28, 20, 32, 17, 26, 14].map((height, index) => (
                <span
                  key={index}
                  className="voice-wave-bar w-1 rounded-full bg-gradient-to-b from-fuchsia-200 to-rose-300"
                  style={{ height: `${height}px`, animationDelay: `${index * -0.08}s` }}
                />
              ))}
            </div>
            <span className="shrink-0 text-xs font-medium text-rose-100">Recording</span>
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share what’s on your mind…"
            className="min-h-[48px] max-h-[150px] flex-1 resize-none rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/80"
          />
        )}
        <Button
          type="button"
          onClick={toggleRecording}
          disabled={isThinking || isTranscribing}
          aria-label={isRecording ? "Stop recording" : "Start voice chat"}
          size="icon"
          className={`self-center ${isRecording ? "bg-rose-500 hover:bg-rose-600" : ""}`}
        >
          {isTranscribing ? <LoaderCircle className="animate-spin" size={21} /> : isRecording ? <Square size={19} fill="currentColor" /> : <Mic size={21} />}
        </Button>
        <Button
          onClick={() => void handleSendMessage()}
          disabled={!input.trim() || isThinking}
          aria-label="Send message"
          size="icon"
          className="self-center"
        >
          <Send size={22} />
        </Button>
        </div>
        {(isTranscribing || voiceError) && (
          <p className={`mx-auto mt-2 max-w-4xl px-3 text-xs ${voiceError ? "text-rose-200" : "text-fuchsia-100"}`} role={voiceError ? "alert" : "status"}>
            {voiceError || "Lilly is listening…"}
          </p>
        )}
      </div>
    </div>
  );
}
