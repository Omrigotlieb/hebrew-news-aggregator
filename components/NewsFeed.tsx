'use client';

import { useState } from 'react';
import type { NewsArticle, NewsSource } from '@/types/news';
import { NewsCard } from './NewsCard';

interface NewsFeedProps {
  articles: NewsArticle[];
}

export function NewsFeed({ articles }: NewsFeedProps) {
  const [activeSources, setActiveSources] = useState<Set<NewsSource>>(
    new Set(['ynet', 'n12'])
  );

  const toggleSource = (source: NewsSource) => {
    const newSources = new Set(activeSources);
    if (newSources.has(source)) {
      // Don't allow deselecting all sources
      if (newSources.size > 1) {
        newSources.delete(source);
      }
    } else {
      newSources.add(source);
    }
    setActiveSources(newSources);
  };

  const filteredArticles = articles.filter(article =>
    activeSources.has(article.source)
  );

  return (
    <div>
      <div className="source-filters">
        <button
          className={`source-filter ynet ${activeSources.has('ynet') ? 'active' : ''}`}
          onClick={() => toggleSource('ynet')}
        >
          <span className="source-dot" />
          <span>Ynet</span>
        </button>
        <button
          className={`source-filter n12 ${activeSources.has('n12') ? 'active' : ''}`}
          onClick={() => toggleSource('n12')}
        >
          <span className="source-dot" />
          <span>N12</span>
        </button>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>לא נמצאו חדשות</p>
        </div>
      ) : (
        <div className="news-grid">
          {filteredArticles.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              featured={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
