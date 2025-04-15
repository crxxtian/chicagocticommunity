import NewsAPI from 'newsapi';
import Parser from 'rss-parser';

const newsapi = new NewsAPI(process.env.NEWSAPI_KEY || '');
const parser = new Parser();

export const config = {
  runtime: 'edge',
};

const keywords = [
  "cybersecurity", "ransomware", "malware", "zero-day", "exploit",
  "breach", "leak", "phishing", "ddos", "cve", "vulnerability", "patch",
  "CISA", "APT", "nation-state", "threat actor", "critical infrastructure",
  "chicago", "illinois", "school", "hospital", "gov", "municipality"
];

const rssFeeds = [
  "https://www.cisa.gov/news.xml",
  "https://www.bleepingcomputer.com/feed/",
  "https://feeds.feedburner.com/TheHackersNews",
  "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml"
];

function filterRelevantItems(items: any[], source: string) {
  return items
    .filter((item) => {
      const text = `${item.title || ""} ${item.contentSnippet || item.content || ""}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    })
    .map((item) => {
      const lower = `${item.title} ${item.contentSnippet}`.toLowerCase();
      let category = 'General';

      if (source.includes("cisa") || lower.includes("cisa")) category = "CISA";
      else if (lower.includes("cve") || source.includes("nvd")) category = "CVE";
      else if (lower.includes("ransomware")) category = "Ransomware";
      else if (lower.includes("chicago") || lower.includes("illinois")) category = "Chicago";

      return {
        title: item.title,
        description: item.contentSnippet || item.content || "",
        date: item.isoDate || item.pubDate || "",
        link: item.link,
        category,
      };
    });
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const newsapiRes = await newsapi.v2.everything({
      q: '("cybersecurity" OR "ransomware" OR "breach" OR "CISA") AND (Chicago OR Illinois)',
      searchIn: 'title,description',
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 25,
      excludeDomains: 'newsbreak.com,carbuzz.com,dailymail.co.uk',
    });

    const newsapiItems = (newsapiRes.articles || []).map((item) => {
      let category = "General";
      const lower = `${item.title} ${item.description}`.toLowerCase();
      if (lower.includes("cisa")) category = "CISA";
      else if (lower.includes("cve")) category = "CVE";
      else if (lower.includes("ransomware")) category = "Ransomware";
      else if (lower.includes("chicago") || lower.includes("illinois")) category = "Chicago";

      return {
        title: item.title,
        description: item.description || "",
        date: item.publishedAt,
        link: item.url,
        category,
      };
    });

    const rssResults = await Promise.allSettled(
      rssFeeds.map((url) => parser.parseURL(url))
    );

    const rssItems = rssResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .flatMap((r) => filterRelevantItems(r.value.items || [], r.value.link || ""));

    const merged = [...newsapiItems, ...rssItems];
    const deduped = Array.from(new Map(merged.map(item => [item.link, item])).values());

    return new Response(JSON.stringify(deduped.slice(0, 30)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store", 
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  }
}
