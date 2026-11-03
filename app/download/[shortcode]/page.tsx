'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { MediaItem, SaveInstaMedia, SaveInstaImage, SaveInstaVideo } from '@/types';

type MediaData = MediaItem | SaveInstaMedia;

export default function DownloadPage() {
  const params = useParams();
  const router = useRouter();
  const shortcode = params.shortcode as string;

  const [media, setMedia] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResolution, setSelectedResolution] = useState<string>('');

  useEffect(() => {
    async function fetchMedia() {
      try {
        // Use the original URL format to let the API handle different URL types
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

        // Handle both old format (data.data) and new format (data.media)
        if (data.data) {
          setMedia(data.data);
        } else if (data.media) {
          setMedia(data.media);
        }
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

  const getBestImageUrl = (image: SaveInstaImage): string => {
    if (image.resolution.length > 0) {
      const lastRes = image.resolution[image.resolution.length - 1];
      return Object.values(lastRes)[0] || image.thumb_url;
    }
    return image.thumb_url;
  };

  const getBestVideoUrl = (video: SaveInstaVideo): string => {
    return video.video_src;
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

  // Check if it's the new SaveInstaMedia format
  const isSaveInstaMedia = (m: MediaData): m is SaveInstaMedia => {
    return 'results_images' in m || 'results_videos' in m;
  };

  if (isSaveInstaMedia(media)) {
    const { images, videos } = media;

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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

          {/* Carousel/Multiple Images */}
          {images.length > 0 && (
            <div className="mb-6 space-y-6">
              <h2 className="text-xl font-semibold">Photos ({images.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => {
                  const bestUrl = getBestImageUrl(image);
                  return (
                    <div key={index} className="relative group bg-card rounded-lg overflow-hidden border">
                      <img
                        src={image.thumb_url}
                        alt={`Instagram photo ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDownload(bestUrl)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                        >
                          Download HD
                        </button>
                      </div>
                      {/* Resolution selector */}
                      {image.resolution.length > 1 && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <select
                            value={selectedResolution || bestUrl}
                            onChange={(e) => setSelectedResolution(e.target.value)}
                            className="w-full text-xs bg-black/70 text-white rounded px-2 py-1"
                          >
                            {image.resolution.map((res, i) => {
                              const [label, url] = Object.entries(res)[0];
                              return <option key={i} value={url}>{label}</option>;
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="mb-6 space-y-6">
              <h2 className="text-xl font-semibold">Videos ({videos.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <div key={index} className="bg-card rounded-lg overflow-hidden border">
                    <video
                      src={video.video_src}
                      poster={video.thumb_url}
                      controls
                      className="w-full aspect-video"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="p-4">
                      <button
                        onClick={() => handleDownload(video.video_src)}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Single item fallback info */}
          {((images.length === 1 && videos.length === 0) || (images.length === 0 && videos.length === 1)) && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold">IG</span>
                </div>
                <div>
                  <p className="font-semibold">@instagram_user</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notice */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Downloaded content is for personal use only. Please respect copyright and Instagram's Terms of Service.
          </p>
        </div>
      </div>
    );
  }

  // Old MediaItem format
  const oldMedia = media as MediaItem;

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
          {oldMedia.type === 'video' ? (
            <video
              src={oldMedia.media_urls[0]}
              poster={oldMedia.thumbnail_url}
              controls
              className="w-full"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={oldMedia.thumbnail_url}
              alt={oldMedia.caption || 'Instagram post'}
              className="w-full"
            />
          )}
        </div>

        {/* Media Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold">{oldMedia.username[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold">@{oldMedia.username}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(oldMedia.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          {oldMedia.caption && (
            <p className="text-sm text-muted-foreground line-clamp-3">{oldMedia.caption}</p>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={() => handleDownload(oldMedia.thumbnail_url)}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download {oldMedia.type === 'video' ? 'Video' : 'Photo'}
        </button>

        {/* Notice */}
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Downloaded content is for personal use only. Please respect copyright and Instagram's Terms of Service.
        </p>
      </div>
    </div>
  );
}