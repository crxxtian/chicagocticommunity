import NewsAPI from 'newsapi';

const newsapi = new NewsAPI(process.env.NEWSAPI_KEY || '');

export default async function handler(req: any, res: any) {
  if (!process.env.NEWSAPI_KEY) {
    return res.status(500).json({ error: 'Missing NEWSAPI_KEY in environment' });
  }

  try {
    // Strategic query: local + high-signal cyber
    const query = `("cybersecurity" OR "ransomware" OR "data breach" OR "CISA") AND (Chicago OR Illinois)`;

    const response = await newsapi.v2.everything({
      q: query,
      searchIn: 'title,description',
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 30,
      excludeDomains: 'newsbreak.com,bringatrailer.com,dailymail.co.uk,carbuzz.com',
    });

    if (response.status !== 'ok') {
      return res.status(502).json({ error: 'NewsAPI error', details: response });
    }

    const keywords = [
      // Threats & Tactics
      "cybersecurity", "ransomware", "malware", "zero-day", "exploit",
      "breach", "leak", "phishing", "denial of service", "ddos",
      "cve", "vulnerability", "rootkit", "backdoor", "supply chain attack",

      // Adversaries
      "APT", "threat actor", "nation-state", "hacktivist", "cyber gang",

      // Defense & Response
      "CISA", "FBI", "NSA", "Homeland Security", "patch", "advisory",
      "response", "mitigation", "takedown", "disruption", "alert", "intel",

      // Regional relevance
      "Chicago", "Illinois", "Midwest", "Cook County", "US infrastructure",

      // Sectors
      "hospital", "school", "public sector", "government", "municipality", "energy",
      "critical infrastructure", "education", "transportation", "manufacturing"
    ];

    const filtered = response.articles.filter((item) => {
      const content = `${item.title} ${item.description}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw));
    });

    const simplified = filtered.map((item) => {
      let category = 'General';
      const text = `${item.title} ${item.description}`.toLowerCase();
      if (text.includes('chicago') || text.includes('illinois') || text.includes('midwest')) {
        category = 'Chicago';
      } else if (text.includes('cisa')) {
        category = 'CISA';
      } else if (text.includes('ransomware')) {
        category = 'Ransomware';
      } else if (text.includes('breach')) {
        category = 'Breach';
      } else if (text.includes('apt') || text.includes('nation-state')) {
        category = 'APT';
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
    console.error('News fetch error:', err);
    return res.status(500).json({ error: err.message || 'Unexpected error' });
  }
}
