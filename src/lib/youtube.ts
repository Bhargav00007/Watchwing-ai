export class YouTubeProcessor {
  // Extract video ID from YouTube URL
  static extractVideoId(url: string): string | null {
    if (!url) return null;

    // Regular expression patterns for YouTube URLs
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  // Check if URL is a YouTube URL
  static isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  }

  // Generate YouTube timestamp URL
  static generateTimestampUrl(videoId: string, seconds: number): string {
    return `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;
  }

  // Format seconds to MM:SS
  static formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Generate timestamp link HTML
  static generateTimestampLink(
    videoId: string,
    seconds: number,
    displayTime: string
  ): string {
    const timestampUrl = this.generateTimestampUrl(videoId, seconds);
    return `<a class="sai-timestamp-link" href="${timestampUrl}" target="_blank">[${displayTime}]</a>`;
  }

  // Parse timestamp string (MM:SS or seconds)
  static parseTimestamp(timestamp: string): number | null {
    if (!timestamp) return null;

    // Handle MM:SS format
    const mmssMatch = timestamp.match(/^(\d{1,2}):(\d{2})$/);
    if (mmssMatch) {
      const minutes = parseInt(mmssMatch[1]);
      const seconds = parseInt(mmssMatch[2]);
      return minutes * 60 + seconds;
    }

    // Handle seconds format (e.g., "120s")
    const secondsMatch = timestamp.match(/^(\d+)s?$/i);
    if (secondsMatch) {
      return parseInt(secondsMatch[1]);
    }

    return null;
  }

  // Extract all timestamps from text
  static extractTimestampsFromText(
    text: string
  ): Array<{ timestamp: string; seconds: number }> {
    const timestamps: Array<{ timestamp: string; seconds: number }> = [];

    // Match patterns like [MM:SS], (MM:SS), MM:SS, or 120s
    const patterns = [
      /[\[\(](\d{1,2}:\d{2})[\]\)]/g,
      /(?<![\w\/=\-])(\d{1,2}:\d{2})(?![\w\]])/g,
      /(?<![\w\/=\-])(\d+)s(?![\w\]])/gi,
    ];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          const cleanTimestamp = match
            .replace(/[\[\]\(\)]/g, "")
            .replace(/s$/i, "");
          const seconds = this.parseTimestamp(cleanTimestamp);
          if (seconds !== null) {
            timestamps.push({
              timestamp: match,
              seconds: seconds,
            });
          }
        });
      }
    }

    // Remove duplicates
    const uniqueTimestamps = timestamps.filter(
      (ts, index, self) =>
        index === self.findIndex((t) => t.seconds === ts.seconds)
    );

    return uniqueTimestamps;
  }
}
