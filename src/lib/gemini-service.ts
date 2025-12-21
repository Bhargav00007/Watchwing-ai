/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { KeyManager } from "./key-manager";
import { types } from "util";

export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
  technicalError?: string;
  keyIndex?: number;
}

export class GeminiService {
  // Create Gemini client with a specific key
  private static createGeminiClient(apiKey: string) {
    return new GoogleGenerativeAI(apiKey);
  }

  // Enhanced response processing
  static processAIResponse(rawText: string): string {
    if (!rawText || rawText.trim() === "No response from AI") {
      return "I'm having trouble processing your request right now. Could you try asking in a different way or provide more context?";
    }

    let processedText = rawText
      .replace(/^```\w*\n?/g, "")
      .replace(/\n?```$/g, "")
      .trim();

    // Post-process to ensure "screen" terminology is used consistently
    processedText = this.enforceScreenTerminology(processedText);

    // Preserve code blocks with proper formatting
    processedText = processedText.replace(
      /```(\w+)?\s*([\s\S]*?)```/g,
      (match, lang, code) => {
        const language = lang || "text";
        return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
      }
    );

    return processedText;
  }

  // Enforce "screen" terminology instead of "image" or "screenshot"
  private static enforceScreenTerminology(text: string): string {
    const replacements = [
      { pattern: /\bimage\b/gi, replacement: "screen" },
      { pattern: /\bscreenshot\b/gi, replacement: "screen" },
      { pattern: /\bpicture\b/gi, replacement: "screen" },
      { pattern: /\bphoto\b/gi, replacement: "screen" },
      { pattern: /\bcapture\b/gi, replacement: "screen" },
      { pattern: /\bsnap\b/gi, replacement: "screen" },
      { pattern: /\bthe image\b/gi, replacement: "the screen" },
      { pattern: /\ban image\b/gi, replacement: "a screen" },
      { pattern: /\bin the image\b/gi, replacement: "on the screen" },
      { pattern: /\bin this image\b/gi, replacement: "on this screen" },
      { pattern: /\bin your image\b/gi, replacement: "on your screen" },
      { pattern: /\bin the screenshot\b/gi, replacement: "on the screen" },
      { pattern: /\bwhat's in the\b/gi, replacement: "what's on the" },
      { pattern: /\bI can see in the\b/gi, replacement: "I can see on the" },
      { pattern: /\bshown in the\b/gi, replacement: "shown on the" },
      { pattern: /\bdisplayed in the\b/gi, replacement: "displayed on the" },
      { pattern: /\bvisible in the\b/gi, replacement: "visible on the" },
      { pattern: /\bappears in the\b/gi, replacement: "appears on the" },
    ];

    let result = text;
    for (const { pattern, replacement } of replacements) {
      result = result.replace(pattern, replacement);
    }

    return result;
  }

  // Generate user-friendly error messages
  static generateUserFriendlyError(technicalError: string): string {
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

  // Enhanced request function with random key selection
  static async generateContent(
    contents: any,
    maxTokens: number,
    maxRetries: number = KeyManager.getAvailableKeys().length * 2
  ): Promise<GeminiResponse> {
    let lastError: Error | null = null;
    const attemptedKeys = new Set<string>();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Get a random available key
      const currentKey = KeyManager.getRandomAvailableKey();

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
      const keyIndex = KeyManager.getKeyIndex(currentKey);

      try {
        console.log(
          `Attempt ${attempt + 1}/${maxRetries} with key ${keyIndex}`
        );

        const genAI = this.createGeminiClient(currentKey);
        const model = genAI.getGenerativeModel({
          model: KeyManager.getModel(),
          generationConfig: {
            temperature: 0.3, // Lower temperature for more deterministic coding responses
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

        const processedText = this.processAIResponse(text);

        // Record success
        KeyManager.recordKeySuccess(currentKey);

        return {
          success: true,
          text: processedText,
          keyIndex: keyIndex,
        };
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const errorType = KeyManager.classifyError(lastError);

        console.error(
          `Attempt ${attempt + 1} failed with key ${keyIndex} (${errorType}):`,
          lastError.message
        );

        // Record error for this key
        KeyManager.recordKeyError(currentKey, errorType);

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
    const userFriendlyError = this.generateUserFriendlyError(errorMessage);

    return {
      success: false,
      error: userFriendlyError,
      technicalError:
        process.env.NODE_ENV === "development" ? errorMessage : undefined,
    };
  }
}
