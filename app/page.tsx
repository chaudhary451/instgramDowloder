'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { extractShortcode, isValidInstagramURL } from '@/lib/instagram';
import type { MediaItem } from '@/types';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const router = useRouter();

  // Auto-fetch when valid URL is pasted
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (url && isValidInstagramURL(url)) {
        fetchMedia(url);
      } else {
        setMedia(null);
        setError('');
      }
    }, 300); // 300ms debounce - instant feel!

    return () => clearTimeout(timeoutId);
  }, [url]);

  const fetchMedia = async (instagramUrl: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: instagramUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to load media');
        setMedia(null);
      } else {
        setMedia(data.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to load media. Please try again.');
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (mediaUrl: string) => {
    window.open(mediaUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Download Instagram<br />Videos & Photos
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Fast, free, and no watermarks. Download posts, reels, and IGTV videos without login.
        </p>

        {/* URL Input Form */}
        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Instagram URL here..."
              className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive text-left">{error}</p>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground text-left">Loading preview...</p>
          )}
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Example: https://www.instagram.com/p/ABC123xyz/
        </p>

        {/* Media Preview - Shows automatically when URL is pasted */}
        {media && !loading && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="border rounded-lg overflow-hidden bg-card shadow-lg">
              {/* Media Display */}
              <div className="relative">
                {media.type === 'video' ? (
                  <video
                    src={media.media_urls[0]}
                    poster={media.thumbnail_url}
                    controls
                    className="w-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={media.thumbnail_url}
                    alt={media.caption || 'Instagram post'}
                    className="w-full"
                  />
                )}
              </div>

              {/* Media Info */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold">{media.username[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold">@{media.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(media.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {media.caption && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{media.caption}</p>
                )}

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(media.media_urls[0] || media.thumbnail_url)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {media.type === 'video' ? 'Video' : 'Photo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose InstaDown?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">No Login Required</h3>
            <p className="text-sm text-muted-foreground">Download instantly without creating an account or signing in.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">No Watermark</h3>
            <p className="text-sm text-muted-foreground">Download clean videos and photos without any watermarks.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Fast & Free</h3>
            <p className="text-sm text-muted-foreground">Lightning-fast downloads. Always free, no hidden charges.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold mb-1">Copy Instagram Link</h3>
              <p className="text-sm text-muted-foreground">Open Instagram, find the post/reel you want, and copy its URL.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold mb-1">Paste URL</h3>
              <p className="text-sm text-muted-foreground">Paste the link into the input box above and click Download.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold mb-1">Save to Device</h3>
              <p className="text-sm text-muted-foreground">Preview and download the video or photo to your device in HD quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <details className="group border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Is this service free?
              <svg className="w-5 h-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">
              Yes, InstaDown is completely free with no hidden charges. You can download unlimited posts and videos.
            </p>
          </details>
          <details className="group border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Do I need to log in?
              <svg className="w-5 h-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">
              No login required. Simply paste the Instagram URL and download instantly.
            </p>
          </details>
          <details className="group border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Can I download private posts?
              <svg className="w-5 h-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">
              No, this tool only works with public Instagram posts. Private content cannot be accessed.
            </p>
          </details>
          <details className="group border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              What quality are the downloads?
              <svg className="w-5 h-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">
              We provide the highest quality available, typically HD (1080p) for videos and original resolution for photos.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
