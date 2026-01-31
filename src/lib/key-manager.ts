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
  process.env.GEMINI_API_KEY_12,
  process.env.GEMINI_API_KEY_13,
  process.env.GEMINI_API_KEY_14,
  process.env.GEMINI_API_KEY_15,
  process.env.GEMINI_API_KEY_16,
  process.env.GEMINI_API_KEY_17,
  process.env.GEMINI_API_KEY_18,
  process.env.GEMINI_API_KEY_19,
].filter(Boolean);

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (GEMINI_KEYS.length === 0) {
  throw new Error("Please set at least GEMINI_API_KEY in .env.local");
}

interface KeyStatus {
  errorCount: number;
  lastErrorTime: number;
  isBlacklisted: boolean;
  consecutiveErrors: number;
}

export class KeyManager {
  private static keyStatusMap = new Map<string, KeyStatus>();
  private static MAX_CONSECUTIVE_ERRORS = 3;
  private static ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes
  private static BLACKLIST_TIME = 15 * 60 * 1000; // 15 minutes

  static {
    // Initialize key status for all keys
    GEMINI_KEYS.forEach((key) => {
      if (key) {
        this.keyStatusMap.set(key, {
          errorCount: 0,
          lastErrorTime: 0,
          isBlacklisted: false,
          consecutiveErrors: 0,
        });
      }
    });
  }

  // Get all available keys
  static getAvailableKeys(): string[] {
    return GEMINI_KEYS.filter(Boolean) as string[];
  }

  // Get a random available key
  static getRandomAvailableKey(): string | null {
    const now = Date.now();

    // Reset blacklisted keys if enough time has passed
    this.keyStatusMap.forEach((status, key) => {
      if (
        status.isBlacklisted &&
        now - status.lastErrorTime > this.BLACKLIST_TIME
      ) {
        console.log(`Key ${GEMINI_KEYS.indexOf(key)} removed from blacklist`);
        status.isBlacklisted = false;
        status.errorCount = 0;
        status.consecutiveErrors = 0;
      }

      // Reset error count if enough time has passed
      if (now - status.lastErrorTime > this.ERROR_RESET_TIME) {
        status.errorCount = 0;
        status.consecutiveErrors = 0;
      }
    });

    // Get all available (non-blacklisted) keys
    const availableKeys = GEMINI_KEYS.filter((key) => {
      if (!key) return false;
      const status = this.keyStatusMap.get(key);
      return status && !status.isBlacklisted;
    });

    if (availableKeys.length === 0) {
      console.error("All API keys are currently blacklisted");
      return null;
    }

    // Sort by error count (prefer keys with fewer errors)
    availableKeys.sort((a, b) => {
      const statusA = this.keyStatusMap.get(a!)!;
      const statusB = this.keyStatusMap.get(b!)!;
      return statusA.errorCount - statusB.errorCount;
    });

    // Pick a random key from the top 50% least-errored keys
    const topHalf = Math.max(1, Math.ceil(availableKeys.length / 2));
    const randomIndex = Math.floor(Math.random() * topHalf);
    const selectedKey = availableKeys[randomIndex];

    const keyIndex = GEMINI_KEYS.indexOf(selectedKey!);
    console.log(
      `Selected random API key index: ${keyIndex} (${availableKeys.length} available)`,
    );

    return selectedKey!;
  }

  // Record error for a key
  static recordKeyError(
    key: string,
    errorType: "quota" | "rate_limit" | "service" | "other",
  ) {
    const status = this.keyStatusMap.get(key);
    if (!status) return;

    const now = Date.now();
    status.errorCount++;
    status.consecutiveErrors++;
    status.lastErrorTime = now;

    const keyIndex = GEMINI_KEYS.indexOf(key);

    // Blacklist key if too many consecutive errors
    if (status.consecutiveErrors >= this.MAX_CONSECUTIVE_ERRORS) {
      status.isBlacklisted = true;
      console.warn(
        `API key ${keyIndex} blacklisted after ${status.consecutiveErrors} consecutive errors (Type: ${errorType})`,
      );
    } else {
      console.log(
        `Error recorded for key ${keyIndex}: ${status.errorCount} total, ${status.consecutiveErrors} consecutive (Type: ${errorType})`,
      );
    }
  }

  // Record success for a key (reset consecutive errors)
  static recordKeySuccess(key: string) {
    const status = this.keyStatusMap.get(key);
    if (!status) return;

    status.consecutiveErrors = 0;
    const keyIndex = GEMINI_KEYS.indexOf(key);
    console.log(`Successful request with key ${keyIndex}`);
  }

  // Classify error type
  static classifyError(
    error: Error,
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

  // Get model name
  static getModel(): string {
    return MODEL;
  }

  // Get key index
  static getKeyIndex(key: string): number {
    return GEMINI_KEYS.indexOf(key);
  }
}
