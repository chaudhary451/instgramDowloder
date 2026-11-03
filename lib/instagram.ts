// Extract Instagram shortcode from URL
export function extractShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/stories\/([A-Za-z0-9_.]+)\/([0-9]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // For stories, return the story ID (second capture group)
      if (pattern.source.includes('stories')) {
        return match[2] || match[1];
      }
      return match[1];
    }
  }

  return null;
}

// Validate Instagram URL - supports posts, reels, stories, profiles
export function isValidInstagramURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('instagram.com')) {
      return false;
    }

    const pathname = urlObj.pathname;

    // Valid patterns: /p/xxx, /reel/xxx, /tv/xxx, /stories/user/id, /username/
    const validPatterns = [
      /^\/p\/[A-Za-z0-9_-]+\/?$/,
      /^\/reel\/[A-Za-z0-9_-]+\/?$/,
      /^\/tv\/[A-Za-z0-9_-]+\/?$/,
      /^\/stories\/[A-Za-z0-9_.]+\/[0-9]+\/?$/,
      /^\/[A-Za-z0-9_.]+\/?$/, // profile
    ];

    return validPatterns.some(pattern => pattern.test(pathname));
  } catch {
    return false;
  }
}

// Create Instagram URL from shortcode
export function createInstagramURL(shortcode: string): string {
  return `https://www.instagram.com/p/${shortcode}/`;
}

// Extract username from profile URL
export function extractUsername(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/^\/([A-Za-z0-9_.]+)\/?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Check if URL is a profile
export function isProfileURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return /^\/[A-Za-z0-9_.]+\/?$/.test(pathname) && !pathname.startsWith('/p/') && !pathname.startsWith('/reel/') && !pathname.startsWith('/tv/') && !pathname.startsWith('/stories/');
  } catch {
    return false;
  }
}

// Check if URL is a story
export function isStoryURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return /^\/stories\/[A-Za-z0-9_.]+\/[0-9]+\/?$/.test(pathname);
  } catch {
    return false;
  }
}