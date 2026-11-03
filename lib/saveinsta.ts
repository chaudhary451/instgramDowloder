// SaveInsta API integration for Instagram media downloading
// Ported from PHP to TypeScript

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

export interface SaveInstaResponse {
  success: boolean;
  media?: SaveInstaMedia;
  error?: string;
  raw?: unknown;
}

// Extract JavaScript variables from script block
function extractJsVar(name: string, source: string): string | null {
  const regex = new RegExp(`${name}\\s*=\\s*"([^"]+)"`);
  const match = source.match(regex);
  return match ? match[1] : null;
}

// Delay helper
function delayRequest(mode: 'fixed' | 'random', fixed: number, min: number, max: number): Promise<void> {
  const sec = mode === 'random'
    ? Math.floor(Math.random() * (max - min + 1) * 10) / 10
    : fixed;
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

// Parse HTML to extract media (ported from PHP's rebuild_and_parse_media)
function parseMedia(html: string): SaveInstaMedia {
  // We'll use a simple regex-based approach since we don't have DOMDocument in Node
  // This mimics the PHP DOMXPath logic

  const result: SaveInstaMedia = {
    results_images: 0,
    results_videos: 0,
    images: [],
    videos: []
  };

  // Find all download-box list items
  const liMatches = html.match(/<ul[^>]*class="[^"]*download-box[^"]*"[^>]*>([\s\S]*?)<\/ul>/g);

  if (!liMatches) return result;

  for (const ulContent of liMatches) {
    // Find individual li elements
    const liElements = ulContent.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];

    for (const li of liElements) {
      // Extract thumbnail
      let thumb: string | null = null;
      const thumbMatch = li.match(/<div[^>]*class="[^"]*download-items__thumb[^"]*"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*(?:data-src="([^"]*)")?/);
      if (thumbMatch) {
        const src = thumbMatch[1];
        const dataSrc = thumbMatch[2];
        if (!src || src === '/imgs/loader.gif') {
          thumb = dataSrc || src;
        } else {
          thumb = src;
        }
      }

      // Check for image/video icon
      const iconMatch = li.match(/<div[^>]*class="[^"]*download-items__thumb[^"]*"[^>]*>[\s\S]*?<i[^>]*class="([^"]*)"[^>]*>/);
      const iconClass = iconMatch ? iconMatch[1] : '';
      const isImage = iconClass.includes('icon-dlimage');
      const isVideo = iconClass.includes('icon-dlvideo');

      // Extract button links
      const btnMatches = li.match(/<div[^>]*class="[^"]*download-items__btn[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g) || [];

      let videoHref: string | null = null;
      for (const btnMatch of btnMatches) {
        const hrefMatch = btnMatch.match(/href="([^"]*)"/);
        const textMatch = btnMatch.match(/>([\s\S]*?)<\/a>/);
        const href = hrefMatch ? hrefMatch[1] : null;
        const text = textMatch ? textMatch[1].toLowerCase().trim() : '';

        // Check for video attribute or "download video" text
        if (btnMatch.includes('video=') || text.includes('download video')) {
          videoHref = href;
          break;
        }
      }

      // If video but no specific href found, use first button
      if (isVideo && !videoHref && btnMatches.length > 0 && btnMatches[0]) {
        const firstBtn = btnMatches[0].match(/href="([^"]*)"/);
        videoHref = firstBtn ? firstBtn[1] : null;
      }

      // Extract resolutions from select options
      const resolutions: Record<string, string>[] = [];
      const optionMatches = li.match(/<div[^>]*class="[^"]*photo-option[^"]*"[^>]*>[\s\S]*?<select[^>]*>([\s\S]*?)<\/select>/g) || [];
      for (const selectContent of optionMatches) {
        const optionElements = selectContent.match(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g) || [];
        for (const opt of optionElements) {
          const valueMatch = opt.match(/value="([^"]*)"/);
          const labelMatch = opt.match(/>([\s\S]*?)<\/option>/);
          if (valueMatch && labelMatch) {
            const label = labelMatch[1].trim();
            const value = valueMatch[1];
            if (label && value) {
              resolutions.push({ [label]: value });
            }
          }
        }
      }

      if (isImage && thumb) {
        result.results_images++;
        result.images.push({
          thumb_url: thumb,
          resolutions_count: resolutions.length,
          resolution: resolutions
        });
      } else if (isVideo && thumb) {
        result.results_videos++;
        result.videos.push({
          thumb_url: thumb,
          video_src: videoHref || '',
          resolutions_count: resolutions.length,
          resolution: resolutions
        });
      }
    }
  }

  return result;
}

// Main function to fetch media from saveinsta.to
export async function fetchSaveInstaMedia(instagramUrl: string): Promise<SaveInstaResponse> {
  try {
    // Validate URL
    if (!instagramUrl || !instagramUrl.includes('instagram.com')) {
      return { success: false, error: 'Invalid Instagram URL' };
    }

    const delayMode: 'fixed' | 'random' = 'random';
    const fixedDelay = 1.5;
    const delayMin = 1;
    const delayMax = 1;

    // Common headers
    const commonHeaders = {
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://saveinsta.to',
      'Sec-CH-UA': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-GPC': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // === STEP 1: Fetch HTML from saveinsta.to/en/highlights to get tokens ===
    const highlightsUrl = 'https://saveinsta.to/en/highlights';
    const highlightsResponse = await fetch(highlightsUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Referer': 'https://www.google.com/',
        'Sec-CH-UA': '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Sec-GPC': '1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
      }
    });

    if (!highlightsResponse.ok) {
      return { success: false, error: 'Failed to fetch highlights page' };
    }

    const highlightsHtml = await highlightsResponse.text();

    // Extract JS variables from script block
    const scriptMatch = highlightsHtml.match(/<script[^>]*>var\s+k_url_search="[^"]+"(.*?)<\/script>/s);
    if (!scriptMatch) {
      return { success: false, error: 'JS token block not found' };
    }

    const scriptBlock = scriptMatch[1];
    const k_prefix_name = extractJsVar('k_prefix_name', scriptBlock);
    const k_exp = extractJsVar('k_exp', scriptBlock);
    const k_token = extractJsVar('k_token', scriptBlock);

    if (!k_exp || !k_token) {
      return { success: false, error: 'Required tokens not found' };
    }

    // === STEP 2: Delay ===
    await delayRequest(delayMode, fixedDelay, delayMin, delayMax);

    // === STEP 3: Get CF token from userverify endpoint ===
    const userverifyResponse = await fetch('https://saveinsta.to/api/userverify', {
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Referer': 'https://saveinsta.to/en/video'
      },
      body: new URLSearchParams({ url: instagramUrl })
    });

    if (!userverifyResponse.ok) {
      return { success: false, error: 'Failed to get CF token' };
    }

    const cftokenData = await userverifyResponse.json();
    if (!cftokenData.token) {
      return { success: false, error: 'CF token not returned' };
    }

    const cftoken = cftokenData.token;

    // === STEP 4: Delay ===
    await delayRequest(delayMode, fixedDelay, delayMin, delayMax);

    // === STEP 5: Request final content from ajaxSearch ===
    const ajaxSearchResponse = await fetch('https://saveinsta.to/api/ajaxSearch', {
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Referer': 'https://saveinsta.to/en/highlights'
      },
      body: new URLSearchParams({
        k_exp: k_exp || '',
        k_token: k_token || '',
        q: instagramUrl,
        t: 'media',
        lang: 'en',
        v: 'v2',
        cftoken: cftoken
      })
    });

    if (!ajaxSearchResponse.ok) {
      return { success: false, error: 'Failed to fetch media data' };
    }

    const finalData = await ajaxSearchResponse.json();

    // === STEP 6: Parse final HTML ===
    if (finalData.status === 'ok' && finalData.data) {
      const parsedMedia = parseMedia(finalData.data);
      return { success: true, media: parsedMedia };
    } else {
      return { success: false, error: 'Invalid response from saveinsta', raw: finalData };
    }

  } catch (error) {
    console.error('SaveInsta fetch error:', error);
    return { success: false, error: 'Failed to fetch media from saveinsta' };
  }
}