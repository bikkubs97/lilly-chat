// app/api/chat/route.ts - Explicit version
import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "assistant" | "user";
  content: string;
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
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2"
    };

    if (ASSISTANT_ID) {
      try {
        console.log("Using Assistant ID:", ASSISTANT_ID);

        // 1. Create thread
        console.log("Creating thread...");
        const threadResponse = await fetch(`${baseURL}/threads`, {
          method: "POST",
          headers,
          body: JSON.stringify({})
        });

        if (!threadResponse.ok) {
          throw new Error(`Thread creation failed: ${threadResponse.status} ${threadResponse.statusText}`);
        }

        const thread = await threadResponse.json();
        console.log("Thread created:", thread.id);

        // 2. Add messages to thread
        for (const message of messages) {
          if (message.role === "user") {
            console.log("Adding message to thread...");
            const messageResponse = await fetch(`${baseURL}/threads/${thread.id}/messages`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                role: "user",
                content: message.content
              })
            });

            if (!messageResponse.ok) {
              throw new Error(`Message creation failed: ${messageResponse.status}`);
            }
          }
        }

        // 3. Create run
        console.log("Creating run...");
        const runResponse = await fetch(`${baseURL}/threads/${thread.id}/runs`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            assistant_id: ASSISTANT_ID
          })
        });

        if (!runResponse.ok) {
          const errorText = await runResponse.text();
          throw new Error(`Run creation failed: ${runResponse.status} ${errorText}`);
        }

        const run = await runResponse.json();
        console.log("Run created:", run.id, "Status:", run.status);

        // 4. Poll for completion
        let runStatus = run.status;
        let attempts = 0;
        const maxAttempts = 30;

        while ((runStatus === "queued" || runStatus === "in_progress") && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log(`Checking run status... Attempt ${attempts + 1}`);
          const statusResponse = await fetch(`${baseURL}/threads/${thread.id}/runs/${run.id}`, {
            headers
          });

          if (!statusResponse.ok) {
            throw new Error(`Status check failed: ${statusResponse.status}`);
          }

          const statusData = await statusResponse.json();
          runStatus = statusData.status;
          console.log("Current status:", runStatus);
          attempts++;
        }

        if (runStatus === "completed") {
          // 5. Get messages
          console.log("Getting messages...");
          const messagesResponse = await fetch(`${baseURL}/threads/${thread.id}/messages`, {
            headers
          });

          if (!messagesResponse.ok) {
            throw new Error(`Messages retrieval failed: ${messagesResponse.status}`);
          }

          const messagesData = await messagesResponse.json();
          const assistantMessage = messagesData.data
            .filter((msg: any) => msg.role === "assistant")
            .sort((a: any, b: any) => b.created_at - a.created_at)[0];

          if (assistantMessage && assistantMessage.content[0]?.type === "text") {
            const reply = assistantMessage.content[0].text.value;
            return NextResponse.json({ reply });
          }
        } else {
          console.log("Run did not complete successfully. Status:", runStatus);
          throw new Error(`Run failed with status: ${runStatus}`);
        }

      } catch (assistantError) {
        console.error("Assistant API error:", assistantError);
        // Fall through to chat completions
      }
    }

    // Fallback to Chat Completions API
    console.log("Using Chat Completions API...");
    const completion = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: 1000,
        temperature: 0.7,
      })
    });

    if (!completion.ok) {
      throw new Error(`Chat completion failed: ${completion.status}`);
    }

    const completionData = await completion.json();
    const reply = completionData.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
    
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}