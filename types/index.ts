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

// SaveInsta media types (extended format with resolutions)
export interface SaveInstaImage {
  thumb_url: string;
  resolutions_count: number;
  resolution: Record<string, string>[];
}

export interface SaveInstaVideo {
  thumb_url: string;
  video_src: string;
  resolutions_count: number;
  resolution: Record<string, string>[];
}

export interface SaveInstaMedia {
  results_images: number;
  results_videos: number;
  images: SaveInstaImage[];
  videos: SaveInstaVideo[];
}

export interface ResolveResponse {
  success: boolean;
  data?: MediaItem;
  error?: string;
}

// Extended response with saveinsta media
export interface SaveInstaResolveResponse {
  success: boolean;
  media?: SaveInstaMedia;
  error?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: number;
}
