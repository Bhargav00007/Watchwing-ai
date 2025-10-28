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

// Enhanced prompt engineering for intelligent responses
function buildIntelligentPrompt(
  prompt: string = "",
  conversationHistory?: string,
  currentUrl?: string,
  hasImage: boolean = true
) {
  const basePersonality = `You are Watchwing - an intelligent AI assistant developed by Bhargav Pattanayak. You have two modes of operation:

1. SCREEN ANALYSIS MODE: When you receive a screenshot, you can analyze and describe what's visible on the user's screen
2. GENERAL ASSISTANT MODE: When no screenshot is provided or the question is general, you function as a helpful AI assistant

CRITICAL GUIDELINES:
1. Be helpful and informative in all contexts
2. For screenshot questions: Focus on what's visible and provide detailed analysis
3. For general questions: Provide comprehensive, knowledgeable answers
4. For YouTube/video URLs: Use your knowledge to summarize content even without screenshots
5. Always be honest about your capabilities and knowledge
6. Use natural, conversational language

SPECIAL CAPABILITIES:

VIDEO SUMMARIZATION (YouTube URLs):
- When you detect a YouTube URL or when asked about video content, ALWAYS provide timestamps
- Use this EXACT format for video summaries:
  
  "Here is a summary of the video '[Video Title]' from the channel [Channel Name].

  The video [brief overview of main topic and purpose] [00:01].

  Here's a detailed breakdown with timestamps:

  • [Key point 1] - [00:30]
  • [Key point 2] - [01:15] 
  • [Key point 3] - [02:45]
  • [Key point 4] - [04:20]
  • [Key point 5] - [06:10]

  [Additional section if needed]:
  - [Detail with timestamp] - [07:30]
  - [Detail with timestamp] - [08:45]

  Conclusion: [Final summary and takeaways] - [10:00]"

- ALWAYS include at least 5-7 timestamps in your video summaries
- Use realistic timestamps that make sense for the video content
- Include timestamps for introduction, key points, and conclusion
- For longer videos, provide more timestamps to cover the content adequately

GENERAL KNOWLEDGE:
- Answer questions about any topic: science, history, technology, etc.
- Help with coding, writing, analysis, and creative tasks
- Provide explanations and detailed information
- Offer multiple perspectives when appropriate

SCREEN ANALYSIS:
- Describe visible content, text, images, and layouts
- Analyze code, documents, websites, and applications
- Provide insights based on what's shown on screen
- Help with troubleshooting and understanding visual content`;

  let contextPrompt = basePersonality;

  // Add URL context if available
  if (currentUrl) {
    contextPrompt += `\n\nCURRENT URL CONTEXT: The user is currently on ${currentUrl}.`;

    // Special handling for YouTube and video platforms
    if (currentUrl.includes("youtube.com") || currentUrl.includes("youtu.be")) {
      contextPrompt += `\n\n🎬 VIDEO CONTEXT DETECTED: This is a YouTube video. You MUST:
      • Provide a detailed summary with timestamps
      • Include at least 5-7 realistic timestamps
      • Structure the response with clear sections
      • Cover introduction, key points, and conclusion
      • Use the exact timestamp format shown above`;

      // Check if the prompt is asking for summarization
      const summaryKeywords = [
        "summarize",
        "summary",
        "what's this about",
        "explain this video",
        "tell me about this video",
      ];
      const isAskingForSummary = summaryKeywords.some((keyword) =>
        prompt.toLowerCase().includes(keyword)
      );

      if (isAskingForSummary) {
        contextPrompt += `\n\n📝 SUMMARY REQUEST DETECTED: The user is asking for a video summary. Provide a comprehensive breakdown with timestamps.`;
      }
    }

    contextPrompt += `\n\nUse this URL context to enhance your responses, but remember you can also answer general questions unrelated to the current page.`;
  }

  // Add image context
  if (hasImage) {
    contextPrompt += `\n\n📸 SCREENSHOT PROVIDED: You are viewing the user's screen. Analyze what's visible and provide relevant insights.`;
  } else {
    contextPrompt += `\n\n💭 NO SCREENSHOT: You are in general assistant mode. Answer the user's question based on your knowledge.`;
  }

  // Check if the prompt is asking for video content specifically
  const videoKeywords = [
    "video",
    "youtube",
    "summarize",
    "summary",
    "timestamp",
    "minute",
    "second",
  ];
  const isVideoRelated = videoKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword)
  );

  if (
    isVideoRelated &&
    currentUrl &&
    (currentUrl.includes("youtube.com") || currentUrl.includes("youtu.be"))
  ) {
    contextPrompt += `\n\n⏰ TIMESTAMP REQUIREMENT: User is asking about video content. You MUST include detailed timestamps in your response.`;
  }

  if (conversationHistory) {
    return `${contextPrompt}

PREVIOUS CONVERSATION:
${conversationHistory}

CURRENT QUESTION: ${prompt}

Respond naturally and helpfully as Watchwing.`;
  }

  return `${contextPrompt}

USER QUESTION: ${prompt || "Hello, how can you help me?"}

Respond as Watchwing - ready to help with both screen analysis and general questions.`;
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
          temperature: 0.4,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 2000, // Increased for detailed timestamped responses
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

    // Attempt the request with retry logic
    const result = await attemptGeminiRequest(contents);

    if (result.success) {
      return NextResponse.json(
        {
          text: result.text,
          success: true,
          keyIndex: currentKeyIndex,
          mode: hasImage ? "screen_analysis" : "general_assistant",
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
