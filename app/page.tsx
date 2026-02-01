import { scrapeAllSources, mergeAndSortArticles } from '@/lib/scraper';
import { NewsFeed } from '@/components/NewsFeed';

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  let articles = [];
  let error = null;

  try {
    const pages = await scrapeAllSources();
    articles = mergeAndSortArticles(pages);
  } catch (e) {
    console.error('Failed to fetch news:', e);
    error = e instanceof Error ? e.message : 'Failed to load news';
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>שגיאה בטעינת החדשות</h2>
        <p>{error}</p>
        <p>נסה לרענן את העמוד</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h2>אין חדשות כרגע</h2>
        <p>נסה לרענן את העמוד בעוד מספר דקות</p>
      </div>
    );
  }

  return <NewsFeed articles={articles} />;
}
