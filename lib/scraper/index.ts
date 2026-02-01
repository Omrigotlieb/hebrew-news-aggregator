import type { NewsArticle, NewsSource, ScrapedPage } from '@/types/news';
import { YnetScraper } from './ynet';
import { N12Scraper } from './n12';
import { BaseScraper } from './base';

const scrapers: Record<NewsSource, BaseScraper> = {
  ynet: new YnetScraper(),
  n12: new N12Scraper(),
};

export async function scrapeSource(source: NewsSource): Promise<ScrapedPage> {
  const scraper = scrapers[source];
  return scraper.scrape();
}

export async function scrapeAllSources(): Promise<ScrapedPage[]> {
  const results = await Promise.all([
    scrapers.ynet.scrape(),
    scrapers.n12.scrape(),
  ]);
  return results;
}

export async function scrapeArticle(
  source: NewsSource,
  url: string
): Promise<NewsArticle | null> {
  const scraper = scrapers[source];
  return scraper.scrapeArticle(url);
}

export function mergeAndSortArticles(pages: ScrapedPage[]): NewsArticle[] {
  const allArticles = pages.flatMap(page => page.articles);

  // Sort by publish date (newest first)
  return allArticles.sort((a, b) =>
    b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

export { YnetScraper, N12Scraper, BaseScraper };
