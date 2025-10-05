// app/api/describe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Multiple API keys for fallback
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean); // Remove any undefined keys

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"; // Updated to 2.5-flash

if (GEMINI_KEYS.length === 0) {
  throw new Error("Please set at least GEMINI_API_KEY in .env.local");
}

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

// Track current active key index
let currentKeyIndex = 0;
const keyErrors = new Map<string, number>(); // Track errors per key

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Function to get current active key
function getCurrentKey() {
  return GEMINI_KEYS[currentKeyIndex];
}

// Function to rotate to next available key
function rotateToNextKey() {
  const originalIndex = currentKeyIndex;

  do {
    currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;

    // If we've tried all keys, reset error counts and try original
    if (currentKeyIndex === originalIndex) {
      resetErrorCounts();
      break;
    }

    const currentKey = GEMINI_KEYS[currentKeyIndex];
    const errorCount = keyErrors.get(currentKey!) || 0;

    // Only use keys with less than 3 recent errors
    if (errorCount < 3) {
      console.log(`Switched to API key index: ${currentKeyIndex}`);
      break;
    }
  } while (currentKeyIndex !== originalIndex);

  return getCurrentKey();
}

// Function to increment error count for a key
function incrementErrorCount(key: string) {
  const count = keyErrors.get(key) || 0;
  keyErrors.set(key, count + 1);

  // Reset error counts after 5 minutes
  setTimeout(() => {
    keyErrors.delete(key);
  }, 5 * 60 * 1000);
}

// Function to reset all error counts
function resetErrorCounts() {
  keyErrors.clear();
  console.log("Reset all API key error counts");
}

// Function to create Gemini client with a specific key
function createGeminiClient(apiKey: string) {
  return new GoogleGenerativeAI(apiKey);
}

// Function to attempt request with retry and key rotation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function attemptGeminiRequest(contents: any, maxRetries = 3) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const currentKey = getCurrentKey();
    const genAI = createGeminiClient(currentKey!);

    try {
      const model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent({ contents });
      const text = (await result.response.text()) || "No response from AI";

      return { success: true, text };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      console.error(
        `Attempt ${attempt + 1} failed with key ${currentKeyIndex}:`,
        lastError.message
      );

      // Increment error count for this key
      incrementErrorCount(currentKey!);

      // Check if this is a retryable error (rate limit, overload, etc.)
      const errorMessage = lastError.message.toLowerCase();
      const isRetryableError =
        errorMessage.includes("overload") ||
        errorMessage.includes("503") ||
        errorMessage.includes("429") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("service unavailable");

      if (isRetryableError && attempt < maxRetries - 1) {
        console.log(`Retryable error detected, rotating API key...`);
        rotateToNextKey();

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        continue;
      }

      // If not retryable or out of retries, break
      break;
    }
  }

  return {
    success: false,
    error: lastError?.message || "All retry attempts failed",
  };
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

    // Attempt the request with retry logic and key rotation
    const result = await attemptGeminiRequest(contents);

    if (result.success) {
      return NextResponse.json(
        {
          text: result.text,
          success: true,
          keyIndex: currentKeyIndex, // For debugging
        },
        { headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        {
          error: result.error,
          success: false,
          keyIndex: currentKeyIndex, // For debugging
        },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err: unknown) {
    console.error("Unexpected error:", err);

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
