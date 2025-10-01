// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface AssistantMessageContent {
  type: "text";
  text: {
    value: string;
  };
}

interface AssistantMessage {
  role: "assistant" | "user";
  content: AssistantMessageContent[];
  created_at: number;
}

interface ThreadResponse {
  id: string;
}

interface RunResponse {
  id: string;
  status: string;
}

interface StatusResponse {
  status: string;
}

interface MessagesResponse {
  data: AssistantMessage[];
}

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request, messages missing or invalid" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const baseURL = "https://api.openai.com/v1";
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    };

    if (ASSISTANT_ID) {
      try {
        // 1. Create thread
        const threadRes = await fetch(`${baseURL}/threads`, {
          method: "POST",
          headers,
          body: JSON.stringify({}),
        });
        if (!threadRes.ok) throw new Error(`Thread creation failed: ${threadRes.status}`);
        const thread: ThreadResponse = await threadRes.json();

        // 2. Add messages to thread
        for (const message of messages) {
          if (message.role === "user") {
            const msgRes = await fetch(`${baseURL}/threads/${thread.id}/messages`, {
              method: "POST",
              headers,
              body: JSON.stringify({ role: "user", content: message.content }),
            });
            if (!msgRes.ok) throw new Error(`Message creation failed: ${msgRes.status}`);
          }
        }

        // 3. Create run
        const runRes = await fetch(`${baseURL}/threads/${thread.id}/runs`, {
          method: "POST",
          headers,
          body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
        });
        if (!runRes.ok) {
          const errText = await runRes.text();
          throw new Error(`Run creation failed: ${runRes.status} ${errText}`);
        }
        const run: RunResponse = await runRes.json();

        // 4. Poll for completion
        let runStatus = run.status;
        let attempts = 0;
        const maxAttempts = 30;

        while ((runStatus === "queued" || runStatus === "in_progress") && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const statusRes = await fetch(`${baseURL}/threads/${thread.id}/runs/${run.id}`, { headers });
          if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status}`);
          const statusData: StatusResponse = await statusRes.json();
          runStatus = statusData.status;
          attempts++;
        }

        if (runStatus === "completed") {
          const messagesRes = await fetch(`${baseURL}/threads/${thread.id}/messages`, { headers });
          if (!messagesRes.ok) throw new Error(`Messages retrieval failed: ${messagesRes.status}`);
          const messagesData: MessagesResponse = await messagesRes.json();

          const assistantMessage = messagesData.data
            .filter(msg => msg.role === "assistant")
            .sort((a, b) => b.created_at - a.created_at)[0];

          if (assistantMessage?.content[0]?.type === "text") {
            const reply = assistantMessage.content[0].text.value;
            return NextResponse.json({ reply });
          }
        }
      } catch (assistantError) {
        console.error("Assistant API error:", assistantError);
        // fallback to Chat Completions
      }
    }

    // Fallback: OpenAI Chat Completions API
    const completionRes = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!completionRes.ok) throw new Error(`Chat completion failed: ${completionRes.status}`);

    const completionData: {
      choices: { message: { content: string } }[];
    } = await completionRes.json();

    const reply = completionData.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
