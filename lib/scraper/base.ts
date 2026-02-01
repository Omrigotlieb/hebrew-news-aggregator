import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NewsArticle, NewsSource, NewsCategory, ScrapedPage } from '@/types/news';

export abstract class BaseScraper {
  abstract source: NewsSource;
  abstract baseUrl: string;

  protected async fetchPage(url: string): Promise<cheerio.CheerioAPI> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 30000,
    });
    return cheerio.load(response.data);
  }

  protected generateId(url: string): string {
    // Create a simple hash from the URL
    const hash = url.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);
    return `${this.source}-${Math.abs(hash).toString(36)}`;
  }

  protected inferCategory(text: string, url: string): NewsCategory {
    const lowerText = text.toLowerCase();
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('sport') || lowerText.includes('כדורגל') || lowerText.includes('ספורט')) {
      return 'sports';
    }
    if (lowerUrl.includes('economy') || lowerUrl.includes('money') || lowerText.includes('כלכלה')) {
      return 'economy';
    }
    if (lowerUrl.includes('politics') || lowerText.includes('פוליטי') || lowerText.includes('כנסת')) {
      return 'politics';
    }
    if (lowerUrl.includes('tech') || lowerUrl.includes('digital') || lowerText.includes('טכנולוגיה')) {
      return 'tech';
    }
    if (lowerUrl.includes('health') || lowerText.includes('בריאות')) {
      return 'health';
    }
    if (lowerUrl.includes('entertainment') || lowerUrl.includes('culture') || lowerText.includes('תרבות')) {
      return 'entertainment';
    }
    if (lowerUrl.includes('world') || lowerUrl.includes('international')) {
      return 'world';
    }
    if (lowerUrl.includes('local') || lowerUrl.includes('news/')) {
      return 'local';
    }
    if (lowerUrl.includes('opinion') || lowerText.includes('דעה')) {
      return 'opinion';
    }

    return 'other';
  }

  abstract scrape(): Promise<ScrapedPage>;
  abstract scrapeArticle(url: string): Promise<NewsArticle | null>;
}
