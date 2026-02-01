import type { NewsArticle, ScrapedPage } from '@/types/news';
import { BaseScraper } from './base';

export class N12Scraper extends BaseScraper {
  source = 'n12' as const;
  baseUrl = 'https://www.mako.co.il/news';

  async scrape(): Promise<ScrapedPage> {
    const scrapedAt = new Date();
    const articles: NewsArticle[] = [];

    try {
      const $ = await this.fetchPage(this.baseUrl);

      // N12/Mako news articles
      $('a[href*="/Article-"]').each((_, el) => {
        const $el = $(el);
        const href = $el.attr('href');
        if (!href) return;

        const url = href.startsWith('http') ? href : `https://www.mako.co.il${href}`;

        // Get the title
        const title = $el.find('h2, h3, h4, .title, .headline').first().text().trim()
          || $el.attr('title')
          || $el.text().trim();

        if (!title || title.length < 5) return;

        // Avoid duplicates
        const existingUrls = articles.map(a => a.url);
        if (existingUrls.includes(url)) return;

        // Get image if available
        let imageUrl = $el.find('img').attr('src')
          || $el.find('img').attr('data-src')
          || $el.closest('article, .item, .story').find('img').attr('src');

        // Fix relative image URLs
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://www.mako.co.il${imageUrl}`;
        }

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
          publishedAt: scrapedAt,
          scrapedAt,
        });
      });

      return {
        source: this.source,
        articles: articles.slice(0, 50),
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
      const subtitle = $('.sub-title, .subtitle, .article-subtitle, .subTitle').first().text().trim();
      const content = $('.article-body, .article-content, [itemprop="articleBody"]')
        .text()
        .trim();
      const author = $('.author, .writer, [itemprop="author"]').first().text().trim();
      const imageUrl = $('meta[property="og:image"]').attr('content');

      // Try to parse the publish date
      const dateStr = $('time').attr('datetime')
        || $('meta[property="article:published_time"]').attr('content')
        || $('[itemprop="datePublished"]').attr('content');
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
