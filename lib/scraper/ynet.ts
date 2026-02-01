import type { NewsArticle, ScrapedPage } from '@/types/news';
import { BaseScraper } from './base';

export class YnetScraper extends BaseScraper {
  source = 'ynet' as const;
  baseUrl = 'https://www.ynet.co.il';

  async scrape(): Promise<ScrapedPage> {
    const scrapedAt = new Date();
    const articles: NewsArticle[] = [];

    try {
      const $ = await this.fetchPage(this.baseUrl);

      // Main headlines - these are typically in the top story area
      $('a[href*="/article/"]').each((_, el) => {
        const $el = $(el);
        const href = $el.attr('href');
        if (!href) return;

        const url = href.startsWith('http') ? href : `${this.baseUrl}${href}`;

        // Get the title from various possible elements
        const title = $el.find('h2, h3, h4, .title, .headline').first().text().trim()
          || $el.text().trim();

        if (!title || title.length < 5) return;

        // Avoid duplicates
        const existingUrls = articles.map(a => a.url);
        if (existingUrls.includes(url)) return;

        // Get image if available
        const imageUrl = $el.find('img').attr('src')
          || $el.closest('article, .item, .story').find('img').attr('src');

        // Get subtitle if available
        const subtitle = $el.find('.subtitle, .sub-title, p').first().text().trim();

        articles.push({
          id: this.generateId(url),
          title,
          subtitle: subtitle || undefined,
          url,
          imageUrl: imageUrl || undefined,
          source: this.source,
          category: this.inferCategory(title, url),
          publishedAt: scrapedAt, // Will be updated when scraping full article
          scrapedAt,
        });
      });

      return {
        source: this.source,
        articles: articles.slice(0, 50), // Limit to top 50 articles
        scrapedAt,
      };
    } catch (error) {
      return {
        source: this.source,
        articles: [],
        scrapedAt,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async scrapeArticle(url: string): Promise<NewsArticle | null> {
    try {
      const $ = await this.fetchPage(url);
      const scrapedAt = new Date();

      const title = $('h1').first().text().trim();
      const subtitle = $('.sub-title, .subtitle, .article-subtitle').first().text().trim();
      const content = $('.article-body, .text-body, [data-testid="article-body"]')
        .text()
        .trim();
      const author = $('.author, .writer-name, [data-testid="author"]').first().text().trim();
      const imageUrl = $('meta[property="og:image"]').attr('content');

      // Try to parse the publish date
      const dateStr = $('time').attr('datetime')
        || $('meta[property="article:published_time"]').attr('content');
      const publishedAt = dateStr ? new Date(dateStr) : scrapedAt;

      return {
        id: this.generateId(url),
        title,
        subtitle: subtitle || undefined,
        content,
        url,
        imageUrl: imageUrl || undefined,
        source: this.source,
        category: this.inferCategory(title + ' ' + (content || ''), url),
        author: author || undefined,
        publishedAt,
        scrapedAt,
      };
    } catch (error) {
      console.error(`Failed to scrape article ${url}:`, error);
      return null;
    }
  }
}
