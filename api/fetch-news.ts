import Parser from "rss-parser";

const parser = new Parser();

// Keyword list for relevance filtering
const keywords = [
  "cybersecurity", "ransomware", "malware", "zero-day", "exploit",
  "breach", "leak", "phishing", "ddos", "cve", "vulnerability", "patch",
  "CISA", "APT", "nation-state", "threat actor", "critical infrastructure",
  "chicago", "illinois", "school", "hospital", "gov", "municipality"
];

// Curated list of trusted cybersecurity RSS feeds
const rssFeeds = [
  "https://www.bleepingcomputer.com/feed/",
  "https://feeds.feedburner.com/TheHackersNews",
  "https://www.darkreading.com/rss.xml",
  "https://krebsonsecurity.com/feed/",
  "https://us-cert.cisa.gov/ncas/all.xml",
  "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml",
  "https://www.securityweek.com/feed",
  "https://feeds.feedburner.com/Threatpost",
  "https://cybernews.com/feed/",
  "https://podcast.darknetdiaries.com/",
  "https://grahamcluley.com/feed/",
  "https://isc.sans.edu/rssfeed_full.xml",
  "https://www.schneier.com/feed/atom/",
  "https://securelist.com/feed/",
  "https://news.sophos.com/en-us/category/security-operations/feed/",
  "https://news.sophos.com/en-us/category/threat-research/feed/",
  "https://www.troyhunt.com/rss/",
  "https://www.usom.gov.tr/rss/tehdit.rss",
  "https://www.usom.gov.tr/rss/duyuru.rss",
  "https://feeds.feedburner.com/eset/blog",
  "https://cyberalerts.io/rss/latest-public"
];

// Utility: Filter and normalize items
function filterRelevantItems(items: any[], source: string, sourceTitle = "Unknown Source") {
  return items
    .filter((item) => {
      const content = `${item.title || ""} ${item.contentSnippet || item.content || ""}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw));
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
        source: sourceTitle
      };
    });
}

export default async function handler(req: any, res: any) {
  try {
    const { category = "", search = "", page = 1, limit = 30 } = req.query;

    const rssResults = await Promise.allSettled(
      rssFeeds.map((url) => parser.parseURL(url))
    );

    const allItems = rssResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .flatMap((r) =>
        filterRelevantItems(r.value.items || [], r.value.link || "", r.value.title || "Unknown Source")
      );

    // Filter by category and search term if provided
    const filtered = allItems.filter(item => {
      const matchCategory = category ? item.category.toLowerCase() === category.toLowerCase() : true;
      const matchSearch = search
        ? (item.title + item.description).toLowerCase().includes(search.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });

    // Deduplicate by link and sort by newest date
    const dedupedSorted = Array.from(
      new Map(
        filtered
          .filter(item => item.date && !isNaN(new Date(item.date).getTime()))
          .map(item => [item.link, item])
      ).values()
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const start = (pageNum - 1) * pageSize;
    const paged = dedupedSorted.slice(start, start + pageSize);

    // Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

    return res.status(200).json({
      total: dedupedSorted.length,
      page: pageNum,
      pageSize,
      results: paged
    });
  } catch (error: any) {
    console.error("News Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch cybersecurity news." });
  }
}
