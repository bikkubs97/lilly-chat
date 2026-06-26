// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { buildPersonalContextBlock, getPersonalContext } from "@/lib/personal-context";

const LILLY_SYSTEM_PROMPT = `You are Lilly, a warm and empathetic mental-wellness companion.

Guidelines:
- Be warm, non-judgmental, supportive, and conversational.
- Help users reflect on emotions, journal their thoughts, and notice emotional patterns.
- When private context is provided, use it naturally only when it genuinely helps. Never mention retrieval, embeddings, a database, or numbered journal entries.
- Do not claim to be a replacement for a therapist or medical professional. Encourage immediate local emergency support if a user is in imminent danger.
- Never mention ChatGPT. Your name is Lilly.`;

function cleanNickname(nickname?: string) {
  if (!nickname) return "";
  return nickname.trim().replace(/\s+/g, " ").slice(0, 40);
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const token = getTokenFromRequest(req);
    const decoded = token ? verifyToken(token) : null;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const conversationHistory = messages
      .filter((message): message is { role: "user" | "assistant"; content: string } => (
        (message?.role === "user" || message?.role === "assistant") && typeof message.content === "string"
      ))
      .slice(-12);

    const latestUserMessage = [...conversationHistory].reverse().find((message) => message.role === "user");
    if (!latestUserMessage?.content.trim()) {
      return NextResponse.json({ error: "A user message is required" }, { status: 400 });
    }

    const { relevantJournals, recentMoods } = decoded
      ? await getPersonalContext(decoded.userId, latestUserMessage.content)
      : { relevantJournals: [], recentMoods: [] };
    const personalContext = buildPersonalContextBlock(relevantJournals, recentMoods);
    const nickname = cleanNickname(decoded?.nickname);
    const userProfileContext = nickname
      ? `USER PROFILE:\n- The user's name/nickname is ${nickname}. Address them by this name when it feels natural and supportive, but do not overuse it.`
      : "";
    const contextBlocks = [userProfileContext, personalContext].filter(Boolean).join("\n\n");
    const systemPrompt = contextBlocks
      ? `${LILLY_SYSTEM_PROMPT}\n\n--- PRIVATE USER CONTEXT ---\n${contextBlocks}\n--- END PRIVATE USER CONTEXT ---`
      : LILLY_SYSTEM_PROMPT;

    // Send messages to OpenAI Chat API
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "system", content: systemPrompt }, ...conversationHistory],
      temperature: 0.4, // Lower temperature to stick to persona
      max_tokens: 800,
    });

    const reply = response.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";

    return NextResponse.json({
      reply,
      usedJournalContext: relevantJournals.length > 0,
      usedMoodContext: recentMoods.length > 0,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof Error && ["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) {
      return NextResponse.json({ error: "Your session has expired. Please log in again." }, { status: 401 });
    }
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
