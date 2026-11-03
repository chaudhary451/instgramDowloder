import { NextRequest, NextResponse } from 'next/server';
import { extractShortcode, isValidInstagramURL, createInstagramURL } from '@/lib/instagram';
import { checkRateLimit } from '@/lib/rate-limit';
import { fetchSaveInstaMedia } from '@/lib/saveinsta';
import type { MediaItem, ResolveResponse, SaveInstaMedia, SaveInstaResolveResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL - support more URL types (profile, post, reel, story)
    if (!isValidInstagramURL(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Instagram URL. Supported: posts, reels, stories, profiles.' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const canProceed = await checkRateLimit(ip);

    if (!canProceed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // Try SaveInsta API first (supports posts, reels, stories, profiles)
    const saveinstaResponse = await fetchSaveInstaMedia(url);

    if (saveinstaResponse.success && saveinstaResponse.media) {
      const media = saveinstaResponse.media;

      // Convert SaveInsta media to our MediaItem format for backward compatibility
      // Also include the extended media data
      let primaryType: 'image' | 'video' | 'carousel' = 'image';
      let thumbnailUrl = '';
      let mediaUrls: string[] = [];

      if (media.results_images > 0 && media.images.length > 0) {
        primaryType = media.results_images > 1 ? 'carousel' : 'image';
        thumbnailUrl = media.images[0].thumb_url;
        mediaUrls = media.images.map(img => {
          // Get highest resolution URL
          const resolutions = img.resolution;
          if (resolutions.length > 0) {
            // Get the last resolution (usually highest quality)
            const lastRes = resolutions[resolutions.length - 1];
            return Object.values(lastRes)[0] || img.thumb_url;
          }
          return img.thumb_url;
        });
      } else if (media.results_videos > 0 && media.videos.length > 0) {
        primaryType = 'video';
        thumbnailUrl = media.videos[0].thumb_url;
        mediaUrls = media.videos.map(vid => vid.video_src).filter(Boolean);
      }

      const shortcode = extractShortcode(url) || 'unknown';

      const response: SaveInstaResolveResponse = {
        success: true,
        media: media,
      };

      return NextResponse.json(response);
    }

    // Fallback to Instagram oEmbed API for basic info
    const shortcode = extractShortcode(url);
    if (shortcode) {
      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(createInstagramURL(shortcode))}`;
      const oembedResponse = await fetch(oembedUrl);

      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();

        const mediaItem: MediaItem = {
          shortcode,
          type: oembedData.type === 'video' ? 'video' : 'image',
          thumbnail_url: oembedData.thumbnail_url || '',
          media_urls: [oembedData.thumbnail_url || ''],
          caption: oembedData.title || '',
          username: oembedData.author_name || '',
          timestamp: Date.now(),
        };

        const response: ResolveResponse = {
          success: true,
          data: mediaItem,
        };

        return NextResponse.json(response);
      }
    }

    return NextResponse.json(
      { success: false, error: 'Post not found or is private' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Resolve error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve Instagram URL' },
      { status: 500 }
    );
  }
}