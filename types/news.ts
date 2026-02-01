export type NewsSource = 'ynet' | 'n12';

export type NewsCategory =
  | 'breaking'
  | 'politics'
  | 'economy'
  | 'sports'
  | 'tech'
  | 'entertainment'
  | 'health'
  | 'world'
  | 'local'
  | 'opinion'
  | 'other';

export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  summary?: string;
  url: string;
  imageUrl?: string;
  source: NewsSource;
  category: NewsCategory;
  author?: string;
  publishedAt: Date;
  scrapedAt: Date;
}

export interface ScrapedPage {
  source: NewsSource;
  articles: NewsArticle[];
  scrapedAt: Date;
  error?: string;
}

export interface NewsFilter {
  sources?: NewsSource[];
  categories?: NewsCategory[];
  searchQuery?: string;
  fromDate?: Date;
  toDate?: Date;
}
