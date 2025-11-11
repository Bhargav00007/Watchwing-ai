/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Multiple API keys for fallback
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
  process.env.GEMINI_API_KEY_11,
].filter(Boolean);

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

// Enhanced key management system
interface KeyStatus {
  errorCount: number;
  lastErrorTime: number;
  isBlacklisted: boolean;
  consecutiveErrors: number;
}

const keyStatusMap = new Map<string, KeyStatus>();
const MAX_CONSECUTIVE_ERRORS = 3;
const ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes
const BLACKLIST_TIME = 15 * 60 * 1000; // 15 minutes

// Initialize key status for all keys
GEMINI_KEYS.forEach((key) => {
  if (key) {
    keyStatusMap.set(key, {
      errorCount: 0,
      lastErrorTime: 0,
      isBlacklisted: false,
      consecutiveErrors: 0,
    });
  }
});

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Get a random available key
function getRandomAvailableKey(): string | null {
  const now = Date.now();

  // Reset blacklisted keys if enough time has passed
  keyStatusMap.forEach((status, key) => {
    if (status.isBlacklisted && now - status.lastErrorTime > BLACKLIST_TIME) {
      console.log(`Key ${GEMINI_KEYS.indexOf(key)} removed from blacklist`);
      status.isBlacklisted = false;
      status.errorCount = 0;
      status.consecutiveErrors = 0;
    }

    // Reset error count if enough time has passed
    if (now - status.lastErrorTime > ERROR_RESET_TIME) {
      status.errorCount = 0;
      status.consecutiveErrors = 0;
    }
  });

  // Get all available (non-blacklisted) keys
  const availableKeys = GEMINI_KEYS.filter((key) => {
    if (!key) return false;
    const status = keyStatusMap.get(key);
    return status && !status.isBlacklisted;
  });

  if (availableKeys.length === 0) {
    console.error("All API keys are currently blacklisted");
    return null;
  }

  // Sort by error count (prefer keys with fewer errors)
  availableKeys.sort((a, b) => {
    const statusA = keyStatusMap.get(a!)!;
    const statusB = keyStatusMap.get(b!)!;
    return statusA.errorCount - statusB.errorCount;
  });

  // Pick a random key from the top 50% least-errored keys
  const topHalf = Math.max(1, Math.ceil(availableKeys.length / 2));
  const randomIndex = Math.floor(Math.random() * topHalf);
  const selectedKey = availableKeys[randomIndex];

  const keyIndex = GEMINI_KEYS.indexOf(selectedKey!);
  console.log(
    `Selected random API key index: ${keyIndex} (${availableKeys.length} available)`
  );

  return selectedKey!;
}

// Record error for a key
function recordKeyError(
  key: string,
  errorType: "quota" | "rate_limit" | "service" | "other"
) {
  const status = keyStatusMap.get(key);
  if (!status) return;

  const now = Date.now();
  status.errorCount++;
  status.consecutiveErrors++;
  status.lastErrorTime = now;

  const keyIndex = GEMINI_KEYS.indexOf(key);

  // Blacklist key if too many consecutive errors
  if (status.consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
    status.isBlacklisted = true;
    console.warn(
      `API key ${keyIndex} blacklisted after ${status.consecutiveErrors} consecutive errors (Type: ${errorType})`
    );
  } else {
    console.log(
      `Error recorded for key ${keyIndex}: ${status.errorCount} total, ${status.consecutiveErrors} consecutive (Type: ${errorType})`
    );
  }
}

// Record success for a key (reset consecutive errors)
function recordKeySuccess(key: string) {
  const status = keyStatusMap.get(key);
  if (!status) return;

  status.consecutiveErrors = 0;
  const keyIndex = GEMINI_KEYS.indexOf(key);
  console.log(`Successful request with key ${keyIndex}`);
}

// Classify error type
function classifyError(
  error: Error
): "quota" | "rate_limit" | "service" | "other" {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("quota") || errorMessage.includes("429")) {
    return "quota";
  }
  if (errorMessage.includes("rate limit")) {
    return "rate_limit";
  }
  if (
    errorMessage.includes("503") ||
    errorMessage.includes("overload") ||
    errorMessage.includes("service unavailable")
  ) {
    return "service";
  }
  return "other";
}

// Create Gemini client with a specific key
function createGeminiClient(apiKey: string) {
  return new GoogleGenerativeAI(apiKey);
}

// Determine appropriate max tokens based on prompt complexity
function getMaxTokensForPrompt(
  prompt: string = "",
  hasImage: boolean = false
): number {
  const simpleGreetings = ["hi", "hello", "hey", "hi!", "hello!", "hey!"];
  const shortQuestions = [
    "how are you",
    "what's up",
    "how are you?",
    "what's up?",
  ];

  const cleanPrompt = prompt.toLowerCase().trim();

  if (
    simpleGreetings.includes(cleanPrompt) ||
    shortQuestions.some((q) => cleanPrompt.includes(q))
  ) {
    return 150;
  }

  if (cleanPrompt.length < 20 && !hasImage) {
    return 300;
  }

  if (!hasImage && cleanPrompt.length < 100) {
    return 600;
  }

  if (hasImage || cleanPrompt.length >= 100) {
    return 1000;
  }

  return 600;
}

// Enhanced prompt engineering for intelligent but concise responses
function buildIntelligentPrompt(
  prompt: string = "",
  conversationHistory?: string,
  currentUrl?: string,
  hasImage: boolean = true
) {
  const basePersonality = `You are Watchwing - an intelligent AI assistant developed by Bhargav Pattanayak. You have two modes:

1. SCREEN ANALYSIS: When you receive a screen, briefly describe what's visible
2. GENERAL ASSISTANT: When no screen, be a helpful AI assistant

CRITICAL GUIDELINES:
- Be helpful but CONCISE - avoid long introductions or explanations
- For simple greetings: Respond briefly and naturally
- For screen: Focus on key elements only
- For general questions: Provide direct, helpful answers
- Use natural, conversational language
- Keep responses appropriate to question length and complexity

SPECIAL CAPABILITIES:

VIDEO SUMMARIZATION (YouTube URLs):
- When detecting YouTube URLs, provide brief summaries with key timestamps
- Use simple format:
  "Summary of '[Video Title]' from [Channel Name]:
  
  • [Key point 1] - [00:30]
  • [Key point 2] - [01:15]
  • [Key point 3] - [02:45]
  
  Conclusion: [Brief takeaway]"

- Include 3-5 key timestamps, not exhaustive lists

GENERAL KNOWLEDGE:
- Answer questions directly and helpfully
- Provide clear explanations without unnecessary detail
- Be conversational and natural

SCREEN ANALYSIS:
- Briefly describe what's visible
- Focus on main content and key elements
- Avoid exhaustive descriptions`;

  let contextPrompt = basePersonality;

  if (currentUrl) {
    contextPrompt += `\n\nCurrent URL: ${currentUrl}`;

    if (currentUrl.includes("youtube.com") || currentUrl.includes("youtu.be")) {
      contextPrompt += `\n\nThis is a YouTube video. Provide a concise summary with 3-5 key timestamps.`;
    }
  }

  if (hasImage) {
    contextPrompt += `\n\nScreen provided: Briefly describe what you see.`;
  } else {
    contextPrompt += `\n\nNo screen: Answer the question based on your knowledge.`;
  }

  const simplePrompts = ["hi", "hello", "hey", "how are you", "what's up"];
  const isSimplePrompt = simplePrompts.some((simple) =>
    prompt.toLowerCase().trim().includes(simple)
  );

  if (isSimplePrompt) {
    contextPrompt += `\n\nIMPORTANT: This is a simple greeting. Respond briefly and naturally - 1-2 sentences maximum.`;
  }

  if (conversationHistory) {
    return `${contextPrompt}

Previous conversation:
${conversationHistory}

Current question: ${prompt}

Respond naturally and concisely as Watchwing.`;
  }

  return `${contextPrompt}

User: ${prompt || "Hello"}

Respond briefly and naturally as Watchwing.`;
}

// Enhanced response processing
function processAIResponse(rawText: string): string {
  if (!rawText || rawText.trim() === "No response from AI") {
    return "I'm having trouble processing your request right now. Could you try asking in a different way or provide more context?";
  }

  let processedText = rawText
    .replace(/^```\w*\n?/g, "")
    .replace(/\n?```$/g, "")
    .trim();

  processedText = processedText.replace(
    /```(\w+)?\s*([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang || "text";
      return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
    }
  );

  return processedText;
}

// Enhanced request function with random key selection
async function attemptGeminiRequest(
  contents: any,
  maxTokens: number,
  maxRetries = GEMINI_KEYS.length * 2 // Try up to twice the number of available keys
) {
  let lastError: Error | null = null;
  const attemptedKeys = new Set<string>();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Get a random available key
    const currentKey = getRandomAvailableKey();

    if (!currentKey) {
      console.error("No available API keys to try");
      return {
        success: false,
        error:
          "All API keys are temporarily unavailable. Please try again later.",
      };
    }

    // Skip if we've already tried this key in this request
    if (attemptedKeys.has(currentKey)) {
      continue;
    }

    attemptedKeys.add(currentKey);
    const keyIndex = GEMINI_KEYS.indexOf(currentKey);

    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries} with key ${keyIndex}`);

      const genAI = createGeminiClient(currentKey);
      const model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: maxTokens,
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

      // Record success
      recordKeySuccess(currentKey);

      return {
        success: true,
        text: processedText,
        keyIndex: keyIndex,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const errorType = classifyError(lastError);

      console.error(
        `Attempt ${attempt + 1} failed with key ${keyIndex} (${errorType}):`,
        lastError.message
      );

      // Record error for this key
      recordKeyError(currentKey, errorType);

      // Check if error is retryable
      const isRetryableError =
        errorType === "quota" ||
        errorType === "rate_limit" ||
        errorType === "service" ||
        lastError.message.toLowerCase().includes("empty response") ||
        lastError.message.toLowerCase().includes("empty text");

      if (!isRetryableError) {
        console.error("Non-retryable error encountered:", lastError.message);
        break;
      }

      // Add exponential backoff for service errors
      if (errorType === "service" && attempt < maxRetries - 1) {
        const backoffTime = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`Service error - backing off for ${backoffTime}ms`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  // Generate user-friendly error message
  const errorMessage = lastError?.message || "All retry attempts failed";
  const userFriendlyError = generateUserFriendlyError(errorMessage);

  return {
    success: false,
    error: userFriendlyError,
    technicalError:
      process.env.NODE_ENV === "development" ? errorMessage : undefined,
  };
}

// Generate user-friendly error messages
function generateUserFriendlyError(technicalError: string): string {
  const errorLower = technicalError.toLowerCase();

  if (errorLower.includes("quota") || errorLower.includes("429")) {
    return "Our AI service quota has been reached. Please try again in a few minutes.";
  }

  if (errorLower.includes("rate limit")) {
    return "Too many requests at the moment. Please wait a few seconds and try again.";
  }

  if (
    errorLower.includes("503") ||
    errorLower.includes("overload") ||
    errorLower.includes("service unavailable")
  ) {
    return "The AI service is temporarily busy. Please try again in a moment.";
  }

  if (
    errorLower.includes("empty response") ||
    errorLower.includes("empty text")
  ) {
    return "The AI didn't provide a response. Please try rephrasing your question.";
  }

  if (errorLower.includes("all api keys")) {
    return "All our AI services are temporarily unavailable. Please try again in a few minutes.";
  }

  return "Something went wrong while processing your request. Please try again.";
}

// Handle POST request from Chrome extension
export async function POST(req: NextRequest) {
  try {
    const { image, prompt, conversationHistory, currentUrl } = await req.json();

    if (!prompt && !image) {
      return NextResponse.json(
        { error: "Either prompt or image is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const hasImage = !!image;
    let base64 = "";
    let mimeType = "image/png";

    if (image) {
      const match = image.match(/^data:(.+);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64 = match[2];
      } else {
        base64 = image;
      }
    }

    const maxTokens = getMaxTokensForPrompt(prompt, hasImage);
    const finalPrompt = buildIntelligentPrompt(
      prompt,
      conversationHistory,
      currentUrl,
      hasImage
    );

    let contents;

    if (hasImage) {
      contents = [
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
    } else {
      contents = [
        {
          role: "user",
          parts: [
            {
              text: finalPrompt,
            },
          ],
        },
      ];
    }

    const result = await attemptGeminiRequest(contents, maxTokens);

    if (result.success) {
      return NextResponse.json(
        {
          text: result.text,
          success: true,
          keyIndex: result.keyIndex,
          mode: hasImage ? "screen_analysis" : "general_assistant",
          tokensUsed: maxTokens,
        },
        { headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        {
          error: result.error,
          success: false,
          technicalError: result.technicalError,
        },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err: unknown) {
    console.error("Unexpected error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";
    const userFriendlyError = generateUserFriendlyError(message);

    return NextResponse.json(
      {
        error: userFriendlyError,
        success: false,
        debug: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
