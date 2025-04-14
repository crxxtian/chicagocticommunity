export const config = {
  runtime: 'edge',
};

const sources = [
  'https://feeds.feedburner.com/TheHackersNews',
  'https://www.bleepingcomputer.com/feed/',
  'https://www.cisa.gov/news.xml',
  'https://www.govtech.com/rss/category/cybersecurity.rss',
];

const keywords = [
  'cybersecurity', 'breach', 'ransomware', 'data leak', 'zero-day',
  'APT', 'CISA', 'Illinois', 'Midwest', 'Chicago', 'USA', 'gov'
];

export default async function handler(req: Request): Promise<Response> {
  try {
    const feedResults = await Promise.allSettled(
      sources.map(url => fetch(url).then(res => res.text()))
    );

    const items: any[] = [];

    for (const result of feedResults) {
      if (result.status === 'fulfilled') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(result.value, 'text/xml');
        const entries = xmlDoc.querySelectorAll('item');

        entries.forEach((entry) => {
          items.push({
            title: entry.querySelector('title')?.textContent || '',
            link: entry.querySelector('link')?.textContent || '',
            description: entry.querySelector('description')?.textContent || '',
            pubDate: entry.querySelector('pubDate')?.textContent || '',
            category: entry.querySelector('category')?.textContent || 'General',
          });
        });
      }
    }

    // Filter
    const filtered = items.filter((item) => {
      const content = `${item.title} ${item.description}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw.toLowerCase()));
    });

    // Deduplicate + Slice
    const unique = Array.from(new Map(filtered.map((i) => [i.link, i])).values());
    const topItems = unique.slice(0, 20);

    return new Response(JSON.stringify(topItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('News API error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
