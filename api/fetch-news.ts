import { VercelRequest, VercelResponse } from '@vercel/node';
import NewsAPI from 'newsapi';

const newsapi = new NewsAPI(process.env.NEWSAPI_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.NEWSAPI_KEY) {
    return res.status(500).json({ error: 'Missing NEWSAPI_KEY in environment' });
  }

  try {
    const response = await newsapi.v2.topHeadlines({
      q: 'cybersecurity OR ransomware OR data breach OR hacking',
      language: 'en',
      pageSize: 20,
    });

    if (response.status !== 'ok') {
      return res.status(502).json({ error: 'NewsAPI returned an error', details: response });
    }

    const simplified = response.articles.map((item) => ({
      title: item.title,
      description: item.description,
      date: item.publishedAt,
      link: item.url,
      image: item.urlToImage || null,
      source: item.source.name,
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=1800');
    return res.status(200).json(simplified);
  } catch (err: any) {
    console.error('News API error:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch news' });
  }
}
