// Extract Instagram shortcode from URL
export function extractShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Validate Instagram URL
export function isValidInstagramURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('instagram.com') && extractShortcode(url) !== null;
  } catch {
    return false;
  }
}

// Create Instagram URL from shortcode
export function createInstagramURL(shortcode: string): string {
  return `https://www.instagram.com/p/${shortcode}/`;
}
