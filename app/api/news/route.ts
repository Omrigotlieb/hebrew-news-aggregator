import { NextResponse } from 'next/server';
import { scrapeAllSources, mergeAndSortArticles } from '@/lib/scraper';

// Cache the news for 5 minutes
let cachedNews: ReturnType<typeof mergeAndSortArticles> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const now = Date.now();

    // Return cached news if still valid
    if (cachedNews && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json({
        articles: cachedNews,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      });
    }

    // Scrape fresh news
    const pages = await scrapeAllSources();
    const articles = mergeAndSortArticles(pages);

    // Update cache
    cachedNews = articles;
    lastFetchTime = now;

    // Check for errors
    const errors = pages
      .filter(page => page.error)
      .map(page => ({ source: page.source, error: page.error }));

    return NextResponse.json({
      articles,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
