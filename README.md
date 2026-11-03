# InstaDown - Instagram Downloader

A fast, free Instagram downloader built with Next.js 14. Download posts, reels, stories, and profiles without watermarks.

## Features

- ✅ Download posts, reels, IGTV videos
- ✅ Download stories and profile content
- ✅ No watermark, HD quality
- ✅ Carousel support (multi-image posts)
- ✅ Multiple resolution options for images
- ✅ No login required
- ✅ Rate limiting for fair use
- ✅ Mobile responsive
- ✅ Dark mode support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Cache:** Upstash Redis (rate limiting)
- **API:** SaveInsta.to proxy for media resolution
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Upstash Redis account (optional for local dev)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd instadown

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials (optional for local)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```bash
# Required for production
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Optional (for future enhancements)
APIFY_API_TOKEN=apify_api_xxx
```

## How It Works

1. User pastes Instagram URL (post, reel, story, or profile)
2. Backend fetches media via SaveInsta.to API (primary) or Instagram oEmbed API (fallback)
3. Media URLs extracted with multiple resolution options
4. User downloads directly from Instagram CDN / SaveInsta CDN

### Supported URL Types

- **Posts:** `https://www.instagram.com/p/ABC123xyz/`
- **Reels:** `https://www.instagram.com/reel/ABC123xyz/`
- **IGTV:** `https://www.instagram.com/tv/ABC123xyz/`
- **Stories:** `https://www.instagram.com/stories/username/123456789/`
- **Profiles:** `https://www.instagram.com/username/`

## Rate Limiting

- 10 requests per minute per IP address
- Cached results for 5 minutes
- Graceful degradation if Redis unavailable

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Other Platforms

Works on any Node.js hosting:
- Netlify
- Railway
- Render
- Fly.io

## Project Structure

```
instadown/
├── app/
│   ├── api/
│   │   ├── resolve/       # Media resolution endpoint (SaveInsta + oEmbed)
│   │   └── download/      # Download proxy endpoint
│   ├── download/[shortcode]/  # Download page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles + tokens
├── components/
│   ├── ui/                # Reusable UI components
│   ├── URLInput.tsx       # URL input with validation
│   ├── MediaPlayer.tsx    # Video/image/carousel player
│   └── DownloadButton.tsx # Download with states
├── lib/
│   ├── instagram.ts       # URL parsing, validation
│   ├── rate-limit.ts      # Rate limiting logic
│   ├── cache.ts           # Redis cache helpers
│   └── saveinsta.ts       # SaveInsta API integration
└── types/
    └── index.ts           # TypeScript types
```

## API Integration

This project integrates with [SaveInsta.to](https://saveinsta.to) via a TypeScript port of their PHP API. The integration:

1. Fetches dynamic tokens from SaveInsta highlights page
2. Obtains Cloudflare bypass token via userverify endpoint
3. Searches for media via ajaxSearch endpoint
4. Parses HTML response to extract images/videos with resolutions

The original PHP implementation was from [im-syn/Instagram-Downloader](https://github.com/im-syn/Instagram-Downloader).

## Legal

This tool is for personal use only. Users must:
- Respect Instagram's Terms of Service
- Only download content they have permission to access
- Not redistribute downloaded content without authorization

## License

MIT License - see LICENSE file

## Contributing

Contributions welcome! Please open an issue first to discuss changes.

## Support

- **Issues:** [GitHub Issues](your-repo/issues)
- **Email:** support@instadown.example

---

Built with ❤️ using Next.js