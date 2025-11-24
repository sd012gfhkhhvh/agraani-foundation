/**
 * Calculate estimated reading time for blog posts
 * @param content - HTML content of the blog post
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');

  // Count words (split by whitespace)
  const wordCount = text.trim().split(/\s+/).length;

  // Calculate reading time
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}
