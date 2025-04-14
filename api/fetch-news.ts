import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';

export const config = {
  runtime: 'nodejs',
};

const parser = new Parser();

const sources = [
  'https://feeds.feedburner.com/TheHackersNews',
  'https://www.bleepingcomputer.com/feed/',
  'https://www.cisa.gov/news.xml',
  'https://www.govtech.com/rss/category/cybersecurity.rss',
];

const keywords = [
  'cybersecurity', 'breach', 'ransomware', 'data leak', 'zero-day',
  'APT', 'CISA', 'Illinois', 'Midwest', 'Chicago', 'USA', 'gov',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const results = await Promise.allSettled(
      sources.map((url) => parser.parseURL(url))
    );

    const items = results
      .filter((r): r is PromiseFulfilledResult<Parser.Output<any>> => r.status === 'fulfilled')
      .flatMap((r) => r.value.items || []);

    const filtered = items.filter((item) => {
      const content = `${item.title} ${item.contentSnippet}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw.toLowerCase()));
    });

    const deduped = Array.from(
      new Map(filtered.map((item) => [item.link, item])).values()
    );

    const simplified = deduped.slice(0, 20).map((item) => ({
      title: item.title || 'Untitled',
      description: item.contentSnippet || '',
      date: item.pubDate || '',
      link: item.link || '',
      category: item.categories?.[0] || 'General',
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json(simplified);
  } catch (err: any) {
    console.error('News API error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
