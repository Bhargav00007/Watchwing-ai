// app/api/describe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!GEMINI_KEY) {
  throw new Error("Please set GEMINI_API_KEY in .env.local");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // allow all domains
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    const { image, prompt } = await req.json();

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
            text:
              prompt || "Describe what's in this screenshot, please explain.",
          },
        ],
      },
    ];

    // Get model instance
    const model = genAI.getGenerativeModel({ model: MODEL });

    // Generate content
    const result = await model.generateContent({ contents });

    // Extract the text from Gemini response
    const text = (await result.response.text()) || "No response from AI";

    return NextResponse.json({ text }, { headers: corsHeaders });
  } catch (err: unknown) {
    console.error("Gemini error:", err);

    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Internal error";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
