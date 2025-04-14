import NewsAPI from 'newsapi';

const newsapi = new NewsAPI(process.env.NEWSAPI_KEY || '');

export default async function handler(req: any, res: any) {
  if (!process.env.NEWSAPI_KEY) {
    return res.status(500).json({ error: 'Missing NEWSAPI_KEY in environment' });
  }

  try {
    const response = await newsapi.v2.everything({
      q: 'cybersecurity OR ransomware OR CISA OR breach OR hacking OR Illinois OR Chicago',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 30,
    });

    if (response.status !== 'ok') {
      return res.status(502).json({ error: 'NewsAPI error', details: response });
    }

    const simplified = response.articles.map((item) => {
      const content = `${item.title} ${item.description}`.toLowerCase();

      // basic auto-tagging
      let category = 'General';
      if (content.includes('illinois') || content.includes('chicago')) {
        category = 'Chicago';
      } else if (content.includes('cisa')) {
        category = 'CISA';
      } else if (content.includes('ransomware')) {
        category = 'Ransomware';
      } else if (content.includes('breach')) {
        category = 'Breach';
      }

      return {
        title: item.title,
        description: item.description || '',
        date: item.publishedAt,
        link: item.url,
        category,
        image: item.urlToImage || null,
      };
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=1800');
    return res.status(200).json(simplified);
  } catch (err: any) {
    console.error('NewsAPI error:', err);
    return res.status(500).json({ error: err.message || 'Fetch failed' });
  }
}
