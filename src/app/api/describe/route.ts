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

  // Very short responses for simple greetings
  if (
    simpleGreetings.includes(cleanPrompt) ||
    shortQuestions.some((q) => cleanPrompt.includes(q))
  ) {
    return 150; // Very short for simple interactions
  }

  // Short responses for basic questions
  if (cleanPrompt.length < 20 && !hasImage) {
    return 300;
  }

  // Medium responses for normal questions without images
  if (!hasImage && cleanPrompt.length < 100) {
    return 600;
  }

  // Longer responses for complex questions or with images
  if (hasImage || cleanPrompt.length >= 100) {
    return 1000;
  }

  // Default for unknown cases
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

  // Add URL context if available
  if (currentUrl) {
    contextPrompt += `\n\nCurrent URL: ${currentUrl}`;

    if (currentUrl.includes("youtube.com") || currentUrl.includes("youtu.be")) {
      contextPrompt += `\n\nThis is a YouTube video. Provide a concise summary with 3-5 key timestamps.`;
    }
  }

  // Add image context
  if (hasImage) {
    contextPrompt += `\n\nScreen provided: Briefly describe what you see.`;
  } else {
    contextPrompt += `\n\nNo screen: Answer the question based on your knowledge.`;
  }

  // Special instruction for simple interactions
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

// Enhanced request function with better error handling and dynamic token limits
async function attemptGeminiRequest(
  contents: any,
  maxTokens: number,
  maxRetries = 3
) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const currentKey = getCurrentKey();
    const genAI = createGeminiClient(currentKey!);

    try {
      const model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: maxTokens, // Dynamic token limit
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
    const { image, prompt, conversationHistory, currentUrl } = await req.json();

    // Check if we have at least a prompt or image
    if (!prompt && !image) {
      return NextResponse.json(
        { error: "Either prompt or image is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const hasImage = !!image;
    let base64 = "";
    let mimeType = "image/png";

    // Process image if provided
    if (image) {
      const match = image.match(/^data:(.+);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64 = match[2];
      } else {
        // If it's already base64 without data URL prefix
        base64 = image;
      }
    }

    // Calculate appropriate max tokens based on prompt complexity
    const maxTokens = getMaxTokensForPrompt(prompt, hasImage);

    // Build intelligent prompt with context awareness
    const finalPrompt = buildIntelligentPrompt(
      prompt,
      conversationHistory,
      currentUrl,
      hasImage
    );

    // Create the content structure based on whether we have an image
    let contents;

    if (hasImage) {
      // With image: multimodal request
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
      // Without image: text-only request
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

    // Attempt the request with retry logic and dynamic token limit
    const result = await attemptGeminiRequest(contents, maxTokens);

    if (result.success) {
      return NextResponse.json(
        {
          text: result.text,
          success: true,
          keyIndex: currentKeyIndex,
          mode: hasImage ? "screen_analysis" : "general_assistant",
          tokensUsed: maxTokens,
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
