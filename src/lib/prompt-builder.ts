import { CodingPlatformProcessor } from "./coding-platforms";

export class PromptBuilder {
  // Determine appropriate max tokens based on prompt complexity
  static getMaxTokensForPrompt(
    prompt: string = "",
    hasImage: boolean = false,
    youtubeVideoId?: string | null,
    isCodingPlatform: boolean = false
  ): number {
    const simpleGreetings = ["hi", "hello", "hey", "hi!", "hello!", "hey!"];
    const shortQuestions = [
      "how are you",
      "what's up",
      "how are you?",
      "what's up?",
    ];

    // Detect coding-related prompts or coding platforms
    const isCodingRelated = CodingPlatformProcessor.detectCodingContext(
      prompt,
      hasImage
    );

    // Check for YouTube URLs or video summarization requests
    const isYouTubePrompt =
      youtubeVideoId !== null ||
      prompt.includes("youtube.com") ||
      prompt.includes("youtu.be") ||
      prompt.toLowerCase().includes("youtube") ||
      prompt.toLowerCase().includes("video summary") ||
      prompt.toLowerCase().includes("summarize video") ||
      prompt.toLowerCase().includes("summarize");

    const cleanPrompt = prompt.toLowerCase().trim();

    // PRIORITY 1: YouTube video summarization - use 3000 tokens (INCREASED)
    if (isYouTubePrompt || youtubeVideoId) {
      console.log("YouTube video summarization detected - using 3000 tokens");
      return 2000;
    }

    // PRIORITY 2: Coding questions or screenshots - use maximum tokens
    if (isCodingRelated || isCodingPlatform) {
      console.log("Coding context detected - using 4000 tokens");
      return 2000; // Maximum tokens for complex coding solutions
    }

    // Simple greetings and short questions
    if (
      simpleGreetings.includes(cleanPrompt) ||
      shortQuestions.some((q) => cleanPrompt.includes(q))
    ) {
      return 150;
    }

    // Very short prompts without images
    if (cleanPrompt.length < 20 && !hasImage) {
      return 300;
    }

    // Short prompts without images
    if (!hasImage && cleanPrompt.length < 100) {
      return 600;
    }

    // Prompts with images or longer text prompts
    if (hasImage || cleanPrompt.length >= 100) {
      return 1000;
    }

    // Default for other cases
    return 600;
  }

  // Special method for YouTube video summarization
  static getMaxTokensForYouTubeSummarization(): number {
    return 3000; // Increased for better summaries
  }

  // Enhanced prompt engineering for intelligent but concise responses
  static buildIntelligentPrompt(
    prompt: string = "",
    conversationHistory?: string,
    currentUrl?: string,
    hasImage: boolean = false,
    youtubeVideoId?: string | null,
    isCodingPlatform: boolean = false,
    videoTranscript?: string
  ): string {
    const isCodingContext =
      CodingPlatformProcessor.detectCodingContext(prompt, hasImage) ||
      isCodingPlatform;
    const isYouTubeContext = youtubeVideoId !== null;

    const basePersonality = `You are Watchwing - an intelligent AI assistant developed by Bhargav Pattanayak. You have multiple modes:

IMPORTANT TERMINOLOGY RULES:
- ALWAYS use "screen" instead of "image" or "screenshot"
- Refer to it as "your screen" or "the screen" 
- Say "I can see on your screen" not "I can see in the image"
- Use "what's on your screen" not "what's in the screenshot"
- Never use words like: image, screenshot, picture, photo, capture

1. SCREEN ANALYSIS: When you receive a screen, briefly describe what's visible on the screen
2. GENERAL ASSISTANT: When no screen, be a helpful AI assistant
3. CODING TUTOR: When helping with coding practice or technical assessments
4. YOUTUBE SUMMARIZER: When asked to summarize YouTube videos

CRITICAL GUIDELINES:
- Be helpful but CONCISE - avoid long introductions or explanations
- For simple greetings: Respond briefly and naturally
- For screen analysis: Focus on key elements only on the screen
- For general questions: Provide direct, helpful answers
- Use natural, conversational language
- Keep responses appropriate to question length and complexity
- ALWAYS FOLLOW THE TERMINOLOGY RULES ABOVE`;

    // Add coding-specific guidelines when context is detected
    const codingGuidelines = isCodingContext
      ? `

CODING PRACTICE ASSISTANCE MODE:
You are now in Coding Practice Assistant mode. Help users understand and solve coding problems for learning purposes and generate the entire answer.

ETHICAL GUIDELINES FOR CODING HELP:
1. Provide EXPLANATIONS along with code solutions
2. Focus on TEACHING concepts, not just giving answers
3. Suggest multiple approaches with pros/cons
4. Explain time and space complexity
5. Provide code with comments
6. Encourage learning and understanding
7. Remind users that practice builds real skills

CODING RESPONSE FORMAT:
For coding problems, structure your response as:

[Brief Problem Understanding]
- What the problem is asking
- Key constraints and requirements

[Approach]
1. Explain the algorithm/approach
2. Time Complexity: O(?)
3. Space Complexity: O(?)

[Solution Code]
\`\`\`[language]
// Well-commented code
// Explain key parts
\`\`\`

[Key Learning Points]
- What concepts this problem teaches
- How to apply this knowledge
- Common pitfalls to avoid

[Practice Tips]
- Similar problems to try
- Resources for deeper learning

Remember: The goal is  just getting the answer right.`
      : "";

    // Add YouTube-specific guidelines when context is detected
    const youtubeGuidelines = isYouTubeContext
      ? `

YOUTUBE VIDEO SUMMARIZATION MODE:
Summarize YouTube videos with timestamps.

RULES:
1. Summarize video content briefly
2. Include 3-5 key moments with timestamps
3. Use format: [MM:SS] for timestamps
4. Keep summary short and precise
5. Highlight main takeaway
6. Use bullet points

RESPONSE FORMAT:
**Summary of "[Video Title]" from [Channel Name]**

**Key Moments:**
• [00:30] - [Brief description]
• [01:15] - [Brief description]
• [02:45] - [Brief description]

**Main Takeaway:**
[1-2 sentence summary]

If unknown video, say: <span style="color: #ff0000; font-weight: bold;">I am unable to summarize this video with timestamps</span>`
      : "";

    const specialCapabilities = `

SPECIAL CAPABILITIES:

VIDEO SUMMARIZATION (YouTube URLs):
- When detecting YouTube URLs, provide comprehensive summaries with timestamps
- Use your knowledge about popular videos to give accurate summaries
- Include approximate timestamps based on typical video structure
- Be detailed and informative

GENERAL KNOWLEDGE:
- Answer questions directly and helpfully
- Provide clear explanations without unnecessary detail
- Be conversational and natural

SCREEN ANALYSIS:
- Briefly describe what's visible on the screen
- Focus on main content and key elements on the screen
- Avoid exhaustive descriptions
- ALWAYS use "screen" terminology`;

    let contextPrompt =
      basePersonality +
      codingGuidelines +
      youtubeGuidelines +
      specialCapabilities;

    // Add URL context
    if (currentUrl) {
      contextPrompt += `\n\nCurrent URL: ${currentUrl}`;

      if (isYouTubeContext) {
        contextPrompt += `\n\nThis is a YouTube video. Provide a comprehensive summary with 5-7 key timestamps based on your knowledge.`;
      }

      if (isCodingPlatform) {
        contextPrompt += `\n\nUser is on a coding practice platform. Provide thorough, educational coding assistance.`;
      }
    }

    // Handle image/screen context
    if (hasImage) {
      contextPrompt += `\n\nUser's screen provided: Briefly describe what you see on their screen.`;
      if (isCodingContext) {
        contextPrompt += ` If the screen shows a coding problem, analyze it and provide educational assistance.`;
      }
    } else {
      contextPrompt += `\n\nNo screen: Answer the question based on your knowledge.`;
    }

    // Handle simple prompts
    const simplePrompts = ["hi", "hello", "hey", "how are you", "what's up"];
    const isSimplePrompt = simplePrompts.some((simple) =>
      prompt.toLowerCase().trim().includes(simple)
    );

    if (isSimplePrompt && !isCodingContext && !isYouTubeContext) {
      contextPrompt += `\n\nIMPORTANT: This is a simple greeting. Respond briefly and naturally - 1-2 sentences maximum.`;
    }

    // Build final prompt
    if (conversationHistory) {
      return `${contextPrompt}

Previous conversation:
${conversationHistory}

Current question: ${prompt}

Respond naturally and appropriately as Watchwing. ALWAYS use "screen" terminology when referring to visual content.${
        isCodingContext
          ? " Focus on educational value and thorough explanations."
          : isYouTubeContext
          ? " Provide a comprehensive video summary with 5-7 detailed timestamps based on your knowledge about the video."
          : ""
      }`;
    }

    return `${contextPrompt}

User: ${prompt || "Hello"}

Respond appropriately as Watchwing. ALWAYS use "screen" terminology when referring to visual content.${
      isCodingContext
        ? " Provide detailed, educational coding assistance."
        : isYouTubeContext
        ? " Provide a comprehensive video summary with 5-7 detailed timestamps based on your knowledge about the video."
        : " Be brief and natural."
    }`;
  }

  // Specialized prompt for YouTube video summarization WITHOUT transcript
  static buildYouTubeSummaryPromptFromURL(
    videoId: string,
    prompt: string = "",
    videoTitle?: string,
    channelName?: string,
    duration?: string
  ): string {
    return `You are Watchwing - a specialized YouTube video summarizer with extensive knowledge about popular YouTube content.

TASK: Provide a comprehensive summary of the YouTube video with detailed timestamps based on your knowledge.

VIDEO INFORMATION:
- Video ID: ${videoId}
${videoTitle ? `- Title: "${videoTitle}"` : ""}
${channelName ? `- Channel: ${channelName}` : ""}
${duration ? `- Duration: ${duration}` : ""}

USER REQUEST: ${prompt || "Please summarize this YouTube video with timestamps"}

IMPORTANT INSTRUCTIONS:
1. Use your extensive knowledge about YouTube videos to provide an accurate summary
2. For popular videos (music videos, famous tutorials, trending content), you should know the content well
3. Provide 5-7 key moments with approximate timestamps
4. Include detailed descriptions of each key moment
5. Be comprehensive but concise
6. If you know the video structure (e.g., typical song structure for music videos), use that knowledge
7. Provide timestamps even if approximate - they help users navigate the video

SUMMARY GUIDELINES:
1. **Start with a brief overview** of the video
2. **List 5-7 key moments** with timestamps and descriptions
3. **Include the main takeaway/message**
4. **Mention the video type** (music video, tutorial, vlog, documentary, etc.)
5. **Highlight key themes or topics** covered
6. **Use bullet points** for readability
7. **Be detailed and informative** - users rely on your knowledge

RESPONSE FORMAT:
**🎬 Summary of "${videoTitle || "YouTube Video"}"${
      channelName ? ` from ${channelName}` : ""
    }**

**📝 Key Moments:**
• [00:30] - [Detailed description of first key moment - what happens, important visuals, audio, etc.]
• [01:15] - [Detailed description of second key moment]
• [02:45] - [Detailed description of third key moment]
• [04:20] - [Detailed description of fourth key moment]
• [06:10] - [Detailed description of fifth key moment]

**🎯 Main Takeaway:**
[2-3 sentence summary of the video's core message, value, or purpose]

**⏱️ Video Details:**
- Channel: ${channelName || "Unknown"}
- Type: [Music Video/Tutorial/Vlog/Documentary/Entertainment]
- Key Themes: [Main themes or topics covered]
${duration ? `- Duration: ${duration}` : ""}

**💡 Additional Insights:**
[Any additional interesting facts, context, or information about the video]

Remember: You have knowledge about popular YouTube content. Provide the most accurate and helpful summary possible.`;
  }
}
