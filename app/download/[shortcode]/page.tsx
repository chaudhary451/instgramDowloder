'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { MediaItem } from '@/types';

export default function DownloadPage() {
  const params = useParams();
  const router = useRouter();
  const shortcode = params.shortcode as string;

  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetch('/api/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: `https://www.instagram.com/p/${shortcode}/` }),
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to load media');
          setLoading(false);
          return;
        }

        setMedia(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load media. Please try again.');
        setLoading(false);
      }
    }

    fetchMedia();
  }, [shortcode]);

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Error Loading Media</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Another URL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </button>
        </div>

        {/* Media Preview */}
        <div className="mb-6 rounded-lg overflow-hidden border bg-card">
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
        <div className="mb-6">
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
            <p className="text-sm text-muted-foreground line-clamp-3">{media.caption}</p>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={() => handleDownload(media.thumbnail_url)}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download {media.type === 'video' ? 'Video' : 'Photo'}
        </button>

        {/* Notice */}
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Downloaded content is for personal use only. Please respect copyright and Instagram's Terms of Service.
        </p>
      </div>
    </div>
  );
}
