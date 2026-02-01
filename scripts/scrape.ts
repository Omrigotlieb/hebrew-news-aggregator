import { scrapeAllSources, mergeAndSortArticles } from '../lib/scraper';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🔄 Starting news scrape...\n');

  const pages = await scrapeAllSources();

  for (const page of pages) {
    if (page.error) {
      console.log(`❌ ${page.source}: Error - ${page.error}`);
    } else {
      console.log(`✅ ${page.source}: ${page.articles.length} articles`);
    }
  }

  const articles = mergeAndSortArticles(pages);
  console.log(`\n📰 Total articles: ${articles.length}`);

  // Save to file
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
  console.log(`\n💾 Saved to ${outputPath}`);

  // Print first 5 headlines
  console.log('\n📰 Latest headlines:\n');
  articles.slice(0, 5).forEach((article, i) => {
    console.log(`${i + 1}. [${article.source}] ${article.title}`);
  });
}

main().catch(console.error);
