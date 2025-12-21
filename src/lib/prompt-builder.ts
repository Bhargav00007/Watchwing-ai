import { CodingPlatformProcessor } from "./coding-platforms";

export class PromptBuilder {
  // Determine appropriate max tokens based on prompt complexity
  static getMaxTokensForPrompt(
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

    // Detect coding-related prompts or coding platforms
    const isCodingRelated = CodingPlatformProcessor.detectCodingContext(
      prompt,
      hasImage
    );

    const cleanPrompt = prompt.toLowerCase().trim();

    // For coding questions or screenshots of coding problems, use maximum tokens
    if (isCodingRelated) {
      console.log("Coding context detected - using maximum tokens");
      return 4000; // Maximum tokens for complex coding solutions
    }

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
  static buildIntelligentPrompt(
    prompt: string = "",
    conversationHistory?: string,
    currentUrl?: string,
    hasImage: boolean = true,
    youtubeVideoId?: string | null,
    isCodingPlatform: boolean = false
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
You are now in YouTube Video Summarization mode. Provide concise summaries with key timestamps.

VIDEO SUMMARY GUIDELINES:
- Extract 3-5 most important points from the video
- Provide timestamps for each key point (format: [MM:SS])
- Keep summary concise but informative
- Highlight the main message/takeaway
- Use bullet points for clarity

RESPONSE FORMAT:
Summary of '[Video Title]' from [Channel Name]:
  
• [Key point 1] - [00:30]
• [Key point 2] - [01:15]
• [Key point 3] - [02:45]
  
Conclusion: [Brief takeaway]

Note: Don't invent timestamps if the video doesn't mention specific times.`
      : "";

    const specialCapabilities = `

SPECIAL CAPABILITIES:

VIDEO SUMMARIZATION (YouTube URLs):
- When detecting YouTube URLs, provide brief summaries with key timestamps
- Use simple format as shown above

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

    if (currentUrl) {
      contextPrompt += `\n\nCurrent URL: ${currentUrl}`;

      if (isYouTubeContext) {
        contextPrompt += `\n\nThis is a YouTube video. Provide a concise summary with 3-5 key timestamps.`;
      }

      if (isCodingPlatform) {
        contextPrompt += `\n\nUser is on a coding practice platform. Provide thorough, educational coding assistance.`;
      }
    }

    if (hasImage) {
      contextPrompt += `\n\nUser's screen provided: Briefly describe what you see on their screen.`;
      if (isCodingContext) {
        contextPrompt += ` If the screen shows a coding problem, analyze it and provide educational assistance.`;
      }
    } else {
      contextPrompt += `\n\nNo screen: Answer the question based on your knowledge.`;
    }

    const simplePrompts = ["hi", "hello", "hey", "how are you", "what's up"];
    const isSimplePrompt = simplePrompts.some((simple) =>
      prompt.toLowerCase().trim().includes(simple)
    );

    if (isSimplePrompt && !isCodingContext && !isYouTubeContext) {
      contextPrompt += `\n\nIMPORTANT: This is a simple greeting. Respond briefly and naturally - 1-2 sentences maximum.`;
    }

    if (conversationHistory) {
      return `${contextPrompt}

Previous conversation:
${conversationHistory}

Current question: ${prompt}

Respond naturally and appropriately as Watchwing. ALWAYS use "screen" terminology when referring to visual content.${
        isCodingContext
          ? " Focus on educational value and thorough explanations."
          : isYouTubeContext
          ? " Provide clear video summary with timestamps."
          : ""
      }`;
    }

    return `${contextPrompt}

User: ${prompt || "Hello"}

Respond appropriately as Watchwing. ALWAYS use "screen" terminology when referring to visual content.${
      isCodingContext
        ? " Provide detailed, educational coding assistance."
        : isYouTubeContext
        ? " Provide concise video summary with timestamps."
        : " Be brief and natural."
    }`;
  }
}
