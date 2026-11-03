# InstaDown - Instagram Downloader

A fast, free Instagram downloader built with Next.js 14. Download posts, reels, and IGTV videos without watermarks.

## Features

- ✅ Download posts, reels, IGTV videos
- ✅ No watermark, HD quality
- ✅ Carousel support (multi-image posts)
- ✅ No login required
- ✅ Rate limiting for fair use
- ✅ Mobile responsive
- ✅ Dark mode support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Cache:** Upstash Redis (rate limiting)
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

# Optional (for stories/profile features)
APIFY_API_TOKEN=apify_api_xxx
```

## How It Works

1. User pastes Instagram URL
2. Backend resolves media via Instagram oEmbed API
3. Media URLs extracted from embed page
4. User downloads directly from Instagram CDN

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
│   │   ├── resolve/       # Media resolution endpoint
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
│   └── cache.ts           # Redis cache helpers
└── types/
    └── index.ts           # TypeScript types
```

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
