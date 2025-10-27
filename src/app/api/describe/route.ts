// app/api/describe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Multiple API keys for fallback
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean); // Remove any undefined keys

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
const keyErrors = new Map<string, number>();

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

    if (currentKeyIndex === originalIndex) {
      resetErrorCounts();
      break;
    }

    const currentKey = GEMINI_KEYS[currentKeyIndex];
    const errorCount = keyErrors.get(currentKey!) || 0;

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

// Enhanced prompt engineering for better responses
function buildIntelligentPrompt(
  prompt: string = "",
  conversationHistory?: string
) {
  const basePersonality = `You are Watchwing - the user's screen companion developed by Bhargav Pattanayak. You're both looking at the same screen.

CRITICAL GUIDELINES:
1. Be CONCISE but helpful - default to shorter responses (2-4 sentences)
2. Only provide longer explanations when specifically asked for details
3. For code: ALWAYS format code blocks properly with language specification
4. NEVER respond with "No response from AI" - if you can't understand something, say so clearly
5. Use "I can see" naturally when describing the screen
6. For complex code questions, break down your analysis but stay focused

CODE FORMATTING RULES:
- Wrap ALL code in triple backticks with language specification
- Example: \`\`\`javascript [code here] \`\`\`
- No additional text inside code blocks - just pure code
- Include relevant code only`;

  if (conversationHistory) {
    return `${basePersonality}

Previous conversation:
${conversationHistory}

Current question: ${prompt || "What's on my screen right now?"}

Respond naturally as Watchwing while actively viewing their screen.`;
  }

  return `${basePersonality}

User: ${prompt || "What's on my screen right now?"}

Respond as Watchwing looking at their screen. Keep it natural and conversational.`;
}

// Enhanced response processing
function processAIResponse(rawText: string): string {
  if (!rawText || rawText.trim() === "No response from AI") {
    return "I'm having trouble processing this specific screen content right now. Could you try asking in a different way or provide more context about what you'd like me to focus on?";
  }

  // Clean up common Gemini response artifacts
  let processedText = rawText
    .replace(/^```\w*\n?/g, "") // Remove leading code block markers
    .replace(/\n?```$/g, "") // Remove trailing code block markers
    .trim();

  // Ensure code blocks are properly formatted for frontend display
  processedText = processedText.replace(
    /```(\w+)?\s*([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang || "text";
      return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
    }
  );

  return processedText;
}

// Enhanced request function with better error handling
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
          temperature: 0.4, // Lower temperature for more consistent responses
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 800, // Reduced for more concise responses
        },
      });

      const result = await model.generateContent({ contents });

      if (!result || !result.response) {
        throw new Error("Empty response from Gemini API");
      }

      const text = await result.response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty text response from AI");
      }

      const processedText = processAIResponse(text);

      return { success: true, text: processedText };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      console.error(
        `Attempt ${attempt + 1} failed with key ${currentKeyIndex}:`,
        lastError.message
      );

      incrementErrorCount(currentKey!);

      const errorMessage = lastError.message.toLowerCase();
      const isRetryableError =
        errorMessage.includes("overload") ||
        errorMessage.includes("503") ||
        errorMessage.includes("429") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("service unavailable") ||
        errorMessage.includes("empty response") ||
        errorMessage.includes("empty text");

      if (isRetryableError && attempt < maxRetries - 1) {
        console.log(`Retryable error detected, rotating API key...`);
        rotateToNextKey();

        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        continue;
      }

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

    // Build intelligent prompt
    const finalPrompt = buildIntelligentPrompt(prompt, conversationHistory);

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

    // Attempt the request with retry logic
    const result = await attemptGeminiRequest(contents);

    if (result.success) {
      return NextResponse.json(
        {
          text: result.text,
          success: true,
          keyIndex: currentKeyIndex,
        },
        { headers: corsHeaders }
      );
    } else {
      // Provide more user-friendly error messages
      const errorMessageText = result.error ?? "";
      const userFriendlyError = errorMessageText.includes("quota")
        ? "API quota exceeded. Please try again later or contact support."
        : errorMessageText.includes("rate limit")
        ? "Rate limit reached. Please wait a moment and try again."
        : "I'm having trouble processing your request right now. Please try again.";

      return NextResponse.json(
        {
          error: userFriendlyError,
          success: false,
          keyIndex: currentKeyIndex,
        },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err: unknown) {
    console.error("Unexpected error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        success: false,
        debug: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
