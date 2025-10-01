// app/api/describe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash"; // Changed to 2.0 for stability

if (!GEMINI_KEY) {
  throw new Error("Please set GEMINI_API_KEY in .env.local");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle POST request from Chrome extension
export async function POST(req: NextRequest) {
  try {
    const { image, prompt, conversationHistory } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "image (data URL) required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Extract base64 data + mimeType
    let base64 = image;
    let mimeType = "image/png";
    const match = image.match(/^data:(.+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      base64 = match[2];
    }

    // Build immersive prompt with Watchwing personality
    let finalPrompt;

    if (conversationHistory) {
      finalPrompt = `You are Watchwing  - the user's screen companion. You're both looking at the same screen right now. you're developed by Bhargav Pattanayak.

Previous conversation:
${conversationHistory}

Current question: ${prompt || "What's on my screen right now?"}

Respond naturally as Watchwing while looking at their screen. Use "I can see" and speak like you're actively viewing their display together.`;
    } else {
      finalPrompt = `You are Watchwing, a helpful AI companion that can see the user's screen. They're sharing their display with you live. Please help them with what you see.

User: ${prompt || "What's on my screen right now?"}

Respond as Watchwing looking at their screen. Use "I can see" and speak naturally like you're both viewing the same display.`;
    }

    // Create the prompt structure for Gemini
    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
    ];

    // Get model instance with better configuration
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Generate content
    const result = await model.generateContent({ contents });

    // Extract the text from Gemini response
    const text = (await result.response.text()) || "No response from AI";

    return NextResponse.json(
      {
        text,
        success: true,
      },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("Gemini error:", err);

    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Internal error";

    return NextResponse.json(
      {
        error: message,
        success: false,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
