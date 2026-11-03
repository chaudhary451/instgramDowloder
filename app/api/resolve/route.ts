import { NextRequest, NextResponse } from 'next/server';
import { extractShortcode, isValidInstagramURL, createInstagramURL } from '@/lib/instagram';
import { checkRateLimit } from '@/lib/rate-limit';
import type { MediaItem, ResolveResponse } from '@/types';

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

    // Validate URL
    if (!isValidInstagramURL(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Instagram URL' },
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

    const shortcode = extractShortcode(url);
    if (!shortcode) {
      return NextResponse.json(
        { success: false, error: 'Could not extract media ID' },
        { status: 400 }
      );
    }

    // Try Instagram oEmbed API
    const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(createInstagramURL(shortcode))}`;
    const oembedResponse = await fetch(oembedUrl);

    if (!oembedResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Post not found or is private' },
        { status: 404 }
      );
    }

    const oembedData = await oembedResponse.json();

    // Extract basic info from oEmbed
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

  } catch (error) {
    console.error('Resolve error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve Instagram URL' },
      { status: 500 }
    );
  }
}
