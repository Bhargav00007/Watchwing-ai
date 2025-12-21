export class CodingPlatformProcessor {
  // List of coding practice platforms
  private static CODING_PLATFORMS = [
    "hackerrank.com",
    "leetcode.com",
    "codeforces.com",
    "codewars.com",
    "geeksforgeeks.org",
    "codingame.com",
    "topcoder.com",
    "atcoder.jp",
    "exercism.org",
    "edabit.com",
    "spoj.com",
    "codingbat.com",
  ];

  // Coding-related keywords
  private static CODING_KEYWORDS = [
    "hackerrank",
    "leetcode",
    "codeforces",
    "codewars",
    "geeksforgeeks",
    "coding",
    "algorithm",
    "data structure",
    "function",
    "class",
    "method",
    "solve",
    "solution",
    "problem",
    "challenge",
    "test case",
    "time complexity",
    "space complexity",
    "debug",
    "error",
    "exception",
    "compile",
    "runtime",
    "programming",
    "code",
    "syntax",
    "variable",
    "loop",
    "array",
    "string",
    "linked list",
    "tree",
    "graph",
    "dynamic programming",
    "recursion",
    "sort",
    "search",
    "binary",
    "hash",
    "stack",
    "queue",
    "heap",
    "database",
    "sql",
    "api",
    "frontend",
    "backend",
    "fullstack",
    "web development",
    "mobile development",
  ];

  // Check if URL is a coding platform
  static isCodingPlatform(url: string): boolean {
    if (!url) return false;
    return this.CODING_PLATFORMS.some((platform) =>
      url.toLowerCase().includes(platform)
    );
  }

  // Detect if the context involves coding problems or platforms
  static detectCodingContext(
    prompt: string = "",
    hasImage: boolean = false
  ): boolean {
    const promptLower = prompt.toLowerCase();

    // Check for coding keywords in prompt
    const hasCodingKeyword = this.CODING_KEYWORDS.some((keyword) =>
      promptLower.includes(keyword.toLowerCase())
    );

    // Check for coding platform URLs
    const hasCodingPlatform = this.CODING_PLATFORMS.some((platform) =>
      promptLower.includes(platform)
    );

    // If user explicitly mentions coding help
    const explicitCodingRequest =
      promptLower.includes("coding help") ||
      promptLower.includes("solve this code") ||
      promptLower.includes("programming problem") ||
      promptLower.includes("algorithm question") ||
      promptLower.includes("data structure") ||
      promptLower.includes("tech interview") ||
      promptLower.includes("technical assessment");

    // Image context might show coding IDE or problem statement
    const imageContext =
      hasImage &&
      (promptLower.includes("code") ||
        promptLower.includes("problem") ||
        promptLower.includes("question") ||
        promptLower.includes("solve") ||
        promptLower.includes("debug") ||
        promptLower.includes("error") ||
        promptLower.includes("program"));

    return (
      hasCodingKeyword ||
      hasCodingPlatform ||
      explicitCodingRequest ||
      imageContext
    );
  }

  // Get platform name from URL
  static getPlatformName(url: string): string | null {
    if (!url) return null;

    for (const platform of this.CODING_PLATFORMS) {
      if (url.toLowerCase().includes(platform)) {
        // Format platform name nicely
        const name = platform.split(".")[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    return null;
  }

  // Get appropriate programming language for platform
  static getPlatformDefaultLanguage(url: string): string {
    const platformName = this.getPlatformName(url);

    switch (platformName?.toLowerCase()) {
      case "hackerrank":
        return "python";
      case "leetcode":
        return "python";
      case "codeforces":
        return "cpp";
      case "codewars":
        return "javascript";
      case "geeksforgeeks":
        return "python";
      case "topcoder":
        return "java";
      case "atcoder":
        return "cpp";
      default:
        return "python"; // Default to Python
    }
  }

  // Generate platform-specific guidance
  static getPlatformGuidance(url: string): string {
    const platformName = this.getPlatformName(url);

    if (!platformName) return "";

    const guidanceMap: Record<string, string> = {
      Hackerrank:
        "HackerRank focuses on practical coding challenges and skill assessments. Provide solutions with good time complexity explanations.",
      Leetcode:
        "LeetCode is for interview preparation. Focus on optimal solutions, time/space complexity analysis, and edge cases.",
      Codeforces:
        "Codeforces has competitive programming problems. Emphasize algorithm efficiency and mathematical insights.",
      Codewars:
        "Codewars emphasizes clean code and best practices. Provide elegant, well-structured solutions.",
      Geeksforgeeks:
        "GeeksforGeeks focuses on computer science fundamentals. Provide detailed explanations of concepts.",
      Topcoder:
        "Topcoder involves complex algorithm challenges. Focus on mathematical and algorithmic insights.",
      Atcoder:
        "Atcoder has Japanese competitive programming problems. Focus on concise, efficient solutions.",
    };

    return (
      guidanceMap[platformName] ||
      `Focus on providing clear, educational solutions for ${platformName} problems.`
    );
  }
}
