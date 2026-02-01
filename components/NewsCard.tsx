'use client';

import type { NewsArticle } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const categoryLabels: Record<string, string> = {
  breaking: 'מבזק',
  politics: 'פוליטי',
  economy: 'כלכלה',
  sports: 'ספורט',
  tech: 'טכנולוגיה',
  entertainment: 'בידור',
  health: 'בריאות',
  world: 'עולם',
  local: 'מקומי',
  opinion: 'דעה',
  other: 'כללי',
};

const sourceLabels: Record<string, string> = {
  ynet: 'Ynet',
  n12: 'N12',
};

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
    locale: he,
  });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`news-card ${featured ? 'featured' : ''}`}
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="news-card-image"
          loading="lazy"
        />
      )}
      <div className="news-card-content">
        <div className="news-card-meta">
          <span className={`news-card-source ${article.source}`}>
            {sourceLabels[article.source]}
          </span>
          <span className={`news-card-category ${article.category}`}>
            {categoryLabels[article.category]}
          </span>
          <span className="news-card-time">{timeAgo}</span>
        </div>
        <h3 className="news-card-title">{article.title}</h3>
        {article.subtitle && (
          <p className="news-card-subtitle">{article.subtitle}</p>
        )}
      </div>
    </a>
  );
}
