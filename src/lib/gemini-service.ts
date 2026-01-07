/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { KeyManager } from "./key-manager";
import { PromptBuilder } from "./prompt-builder";

export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
  technicalError?: string;
  keyIndex?: number;
  tokensUsed?: number;
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

    // Clean up YouTube summary formatting
    processedText = this.cleanYouTubeSummaryFormatting(processedText);

    return processedText;
  }

  // Clean up YouTube summary formatting
  private static cleanYouTubeSummaryFormatting(text: string): string {
    // Ensure proper markdown formatting for YouTube summaries
    let result = text;

    // Fix common formatting issues in YouTube summaries
    result = result.replace(/\*\*🎬 Summary of\*\*/g, "**🎬 Summary of**");
    result = result.replace(
      /\*\*📝 Key Moments:\*\*/g,
      "\n**📝 Key Moments:**"
    );
    result = result.replace(
      /\*\*🎯 Main Takeaway:\*\*/g,
      "\n**🎯 Main Takeaway:**"
    );
    result = result.replace(
      /\*\*⏱️ Video Details:\*\*/g,
      "\n**⏱️ Video Details:**"
    );
    result = result.replace(
      /\*\*💡 Additional Insights:\*\*/g,
      "\n**💡 Additional Insights:**"
    );

    // Ensure bullet points are properly formatted
    result = result.replace(/^•\s*/gm, "• ");

    // Add emoji formatting for better readability
    result = result.replace(/\*\*🎬 /g, "**🎬 ");
    result = result.replace(/\*\*📝 /g, "**📝 ");
    result = result.replace(/\*\*🎯 /g, "**🎯 ");
    result = result.replace(/\*\*⏱️ /g, "**⏱️ ");
    result = result.replace(/\*\*💡 /g, "**💡 ");

    return result;
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

    if (errorLower.includes("safety")) {
      return "The content was blocked by safety filters. Please try rephrasing your question.";
    }

    if (errorLower.includes("token") && errorLower.includes("limit")) {
      return "The response was too long. Please try asking a more specific question.";
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
    const startTime = Date.now();

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
          `Attempt ${
            attempt + 1
          }/${maxRetries} with key ${keyIndex}, max tokens: ${maxTokens}`
        );

        const genAI = this.createGeminiClient(currentKey);
        const model = genAI.getGenerativeModel({
          model: KeyManager.getModel(),
          generationConfig: {
            temperature: 0.7, // Higher temperature for creative summarization
            topK: 40,
            topP: 0.95,
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
        const responseTime = Date.now() - startTime;

        // Record success
        KeyManager.recordKeySuccess(currentKey);

        // Estimate tokens used (approximate)
        const tokensUsed = Math.ceil(text.length / 4);

        console.log(
          `Request completed in ${responseTime}ms, estimated tokens: ${tokensUsed}`
        );

        return {
          success: true,
          text: processedText,
          keyIndex: keyIndex,
          tokensUsed: tokensUsed,
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

  // Specialized method for YouTube video summarization WITHOUT transcript
  static async generateYouTubeSummaryFromURL(
    videoId: string,
    prompt: string = "",
    videoTitle?: string,
    channelName?: string,
    duration?: string
  ): Promise<GeminiResponse> {
    try {
      console.log(`Generating YouTube summary from URL for video: ${videoId}`);

      // Build specialized YouTube prompt (NO transcript needed)
      const youtubePrompt = PromptBuilder.buildYouTubeSummaryPromptFromURL(
        videoId,
        prompt,
        videoTitle,
        channelName,
        duration
      );

      // Determine max tokens (INCREASED for better summaries)
      const maxTokens = 3500; // Increased to allow comprehensive responses

      console.log(
        `YouTube summary tokens allocated: ${maxTokens}`,
        videoTitle ? `Title: ${videoTitle}` : "",
        channelName ? `Channel: ${channelName}` : ""
      );

      // Prepare content for Gemini
      const contents = [
        {
          role: "user",
          parts: [{ text: youtubePrompt }],
        },
      ];

      // Generate content with specialized settings for summaries
      const result = await this.generateContent(contents, maxTokens);

      if (result.success && result.text) {
        console.log(
          "AI successfully generated YouTube summary with timestamps"
        );

        // Check if summary has timestamps
        const hasTimestamps = /\[\d{1,2}:\d{2}\]/.test(result.text);

        if (!hasTimestamps) {
          console.warn("Generated summary doesn't contain timestamps");
          // Add a fallback section at the end
          result.text += `\n\n<span style="color: #ff0000; font-weight: bold;">Note:</span> I couldn't provide specific timestamps for this video. You can watch it to get the complete experience.`;
        }
      }

      return result;
    } catch (error) {
      console.error("Error generating YouTube summary from URL:", error);
      // Even on error, provide a helpful fallback
      return {
        success: true,
        text: `<span style="color: #ff0000; font-weight: bold;">I am unable to summarize this video with timestamps, but here is what I know:</span>\n\nThis is a YouTube video (ID: ${videoId}). Based on the video information, I don't have specific details about its content. You might want to watch it directly to get the full experience.`,
        technicalError: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Main entry point for generating responses
  static async generateResponse(
    prompt: string = "",
    hasImage: boolean = false,
    conversationHistory?: string,
    currentUrl?: string,
    youtubeVideoId?: string | null,
    isCodingPlatform: boolean = false,
    videoTranscript?: string,
    videoTitle?: string,
    channelName?: string,
    videoDuration?: string
  ): Promise<GeminiResponse> {
    try {
      // Check if this is a YouTube summary request
      const isYouTubeSummary =
        youtubeVideoId !== null ||
        prompt.toLowerCase().includes("youtube") ||
        prompt.toLowerCase().includes("summarize") ||
        prompt.toLowerCase().includes("summary") ||
        (currentUrl &&
          (currentUrl.includes("youtube.com") ||
            currentUrl.includes("youtu.be")));

      // Use specialized method for YouTube summaries WITHOUT transcript
      if (isYouTubeSummary && youtubeVideoId) {
        return await this.generateYouTubeSummaryFromURL(
          youtubeVideoId,
          prompt,
          videoTitle,
          channelName,
          videoDuration
        );
      }

      // Regular request handling
      const maxTokens = PromptBuilder.getMaxTokensForPrompt(
        prompt,
        hasImage,
        youtubeVideoId,
        isCodingPlatform
      );

      console.log(`Generating response with ${maxTokens} tokens`);

      const intelligentPrompt = PromptBuilder.buildIntelligentPrompt(
        prompt,
        conversationHistory,
        currentUrl,
        hasImage,
        youtubeVideoId,
        isCodingPlatform,
        videoTranscript
      );

      const contents = [
        {
          role: "user",
          parts: [{ text: intelligentPrompt }],
        },
      ];

      return await this.generateContent(contents, maxTokens);
    } catch (error) {
      console.error("Error in generateResponse:", error);
      return {
        success: false,
        error: "Failed to process your request. Please try again.",
        technicalError: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Direct method for summarizing YouTube video from URL
  static async summarizeYouTubeVideo(
    videoUrl: string,
    customPrompt?: string
  ): Promise<GeminiResponse> {
    try {
      // Extract video ID from URL
      const videoId = this.extractVideoIdFromUrl(videoUrl);

      if (!videoId) {
        return {
          success: false,
          error:
            "Invalid YouTube URL. Please provide a valid YouTube video URL.",
        };
      }

      // Try to extract video title from URL or use generic
      let videoTitle = "YouTube Video";
      const titleMatch = videoUrl.match(/[?&]title=([^&]+)/);
      if (titleMatch) {
        videoTitle = decodeURIComponent(titleMatch[1]);
      }

      const prompt =
        customPrompt ||
        `Summarize this YouTube video with detailed timestamps: ${videoUrl}`;

      return await this.generateYouTubeSummaryFromURL(
        videoId,
        prompt,
        videoTitle,
        "YouTube Channel", // Default channel name
        undefined // duration
      );
    } catch (error) {
      console.error("Error summarizing YouTube video:", error);
      return {
        success: true,
        text: `<span style="color: #ff0000; font-weight: bold;">I am unable to summarize this video with timestamps, but here is what I know:</span>\n\nThis is a YouTube video. I don't have specific information about its content. You can watch it directly to get the full experience.`,
        technicalError: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Helper method to extract video ID from URL
  private static extractVideoIdFromUrl(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}
