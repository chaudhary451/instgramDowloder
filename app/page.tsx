'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractShortcode, isValidInstagramURL } from '@/lib/instagram';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    if (!isValidInstagramURL(url)) {
      setError('Invalid Instagram URL. Please enter a valid post, reel, or IGTV link.');
      return;
    }

    const shortcode = extractShortcode(url);
    if (!shortcode) {
      setError('Could not extract media ID from URL');
      return;
    }

    setLoading(true);
    router.push(`/download/${shortcode}`);
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
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Instagram URL here..."
              className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Download'}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive text-left">{error}</p>
          )}
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Example: https://www.instagram.com/p/ABC123xyz/
        </p>
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
