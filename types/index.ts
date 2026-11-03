// Instagram media types
export interface MediaItem {
  shortcode: string;
  type: 'image' | 'video' | 'carousel';
  thumbnail_url: string;
  media_urls: string[];
  caption: string;
  username: string;
  timestamp: number;
}

export interface ResolveResponse {
  success: boolean;
  data?: MediaItem;
  error?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: number;
}
