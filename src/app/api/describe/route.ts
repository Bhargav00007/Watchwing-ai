/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { PromptBuilder } from "@/lib/prompt-builder";
import { YouTubeProcessor } from "@/lib/youtube";
import { CodingPlatformProcessor } from "@/lib/coding-platforms";
import { GeminiService } from "@/lib/gemini-service";

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
    const { image, prompt, conversationHistory, currentUrl } = await req.json();

    if (!prompt && !image) {
      return NextResponse.json(
        { error: "Either prompt or image is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const hasImage = !!image;

    // Extract YouTube video ID if present
    const youtubeVideoId = currentUrl
      ? YouTubeProcessor.extractVideoId(currentUrl)
      : null;

    // Check if it's a coding platform
    const isCodingPlatform = currentUrl
      ? CodingPlatformProcessor.isCodingPlatform(currentUrl)
      : false;

    // Build the intelligent prompt
    const finalPrompt = PromptBuilder.buildIntelligentPrompt(
      prompt,
      conversationHistory,
      currentUrl,
      hasImage,
      youtubeVideoId,
      isCodingPlatform
    );

    // Get appropriate max tokens
    const maxTokens = PromptBuilder.getMaxTokensForPrompt(prompt, hasImage);

    // Prepare Gemini request contents
    let contents;
    if (hasImage) {
      let base64 = "";
      let mimeType = "image/png";

      const match = image.match(/^data:(.+);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64 = match[2];
      } else {
        base64 = image;
      }

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

    // Make Gemini API request
    const result = await GeminiService.generateContent(contents, maxTokens);

    if (result.success) {
      return NextResponse.json(
        {
          text: result.text,
          success: true,
          keyIndex: result.keyIndex,
          mode: hasImage
            ? isCodingPlatform
              ? "coding_screen_analysis"
              : "screen_analysis"
            : isCodingPlatform
            ? "coding_assistant"
            : "general_assistant",
          tokensUsed: maxTokens,
          isCodingContext: isCodingPlatform,
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
    const userFriendlyError = GeminiService.generateUserFriendlyError(message);

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
