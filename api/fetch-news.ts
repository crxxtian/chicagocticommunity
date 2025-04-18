import Parser from "rss-parser";

const parser = new Parser();

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
  "https://cyberalerts.io/rss/latest-public",
  "https://www.csoonline.com/index.rss",
  "https://www.infosecurity-magazine.com/rss/news/",
  "https://securityaffairs.com/feed",
  "https://therecord.media/feed",
  "https://www.bankinfosecurity.com/rss_feed.php"
];

const tagAliases: Record<string, string> = {
  china: "China", chinese: "China", prc: "China",
  russia: "Russia", russian: "Russia", moscow: "Russia",
  iran: "Iran", iranian: "Iran", tehran: "Iran",
  "north korea": "North Korea", "north korean": "North Korea", dprk: "North Korea",
  malware: "Malware", "malicious software": "Malware", virus: "Malware",
  ransomware: "Ransomware", exploit: "Exploit",
  "zero-day": "Zero-Day", zeroday: "Zero-Day",
  vulnerability: "Vulnerability", cve: "CVE", patch: "Patch",
  phishing: "Phishing", "spear phishing": "Phishing",
  ddos: "DDoS", "denial of service": "DDoS",
  breach: "Data Breach", "data leak": "Data Breach",
  hospital: "Healthcare", clinic: "Healthcare", healthcare: "Healthcare",
  school: "Education", education: "Education", university: "Education",
  government: "Government", municipality: "Municipality", infrastructure: "Infrastructure",
  chicago: "Chicago", illinois: "Illinois",
  usa: "United States", "u.s.": "United States", america: "United States", us: "United States",
  nato: "NATO",
  espionage: "APT", "threat actor": "APT", apt: "APT",
  hacktivist: "Hacktivism", "supply chain": "Supply Chain", "data exposure": "Data Breach",
  bank: "Finance", financial: "Finance", crypto: "Finance"
};

function extractTags(content: string): string[] {
  const lower = content.toLowerCase();
  const matched = new Set<string>();

  for (const [variant, canonical] of Object.entries(tagAliases)) {
    if (lower.includes(variant.toLowerCase())) {
      matched.add(canonical);
    }
  }

  return Array.from(matched);
}

function filterRelevantItems(items: any[], source: string, sourceTitle = "Unknown Source") {
  return items
    .map((item) => {
      const content = `${item.title || ""} ${item.contentSnippet || item.content || ""}`;
      const tags = extractTags(content);
      return {
        title: item.title,
        description: item.contentSnippet || item.content || "",
        date: item.isoDate || item.pubDate || "",
        link: item.link,
        tags,
        badge: tags[0] || "General",
        source: sourceTitle,
      };
    })
    .filter((item) =>
      item.title &&
      item.title.length > 20 &&
      item.description &&
      item.description.length > 30 &&
      item.date &&
      !isNaN(new Date(item.date).getTime()) &&
      !item.title.toLowerCase().startsWith("cve-") &&
      !item.link?.includes("nvd.nist.gov") &&
      !item.source?.toLowerCase().includes("cyberalerts.io") &&
      item.badge !== "General"
    );
}

export default async function handler(req: any, res: any) {
  try {
    const { search = "", page = 1, limit = 30 } = req.query;

    const rssResults = await Promise.allSettled(
      rssFeeds.map((url) => parser.parseURL(url))
    );

    const parsedItems = rssResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .flatMap((r) =>
        filterRelevantItems(r.value.items || [], r.value.link || "", r.value.title || "Unknown Source")
      );

    const filtered = parsedItems.filter((item) => {
      return search
        ? (item.title + item.description).toLowerCase().includes(search.toLowerCase())
        : true;
    });

    const dedupedSorted = Array.from(
      new Map(filtered.map(item => [item.link, item])).values()
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const pageNum = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const start = (pageNum - 1) * pageSize;
    const paged = dedupedSorted.slice(start, start + pageSize);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

    return res.status(200).json({
      total: dedupedSorted.length,
      page: pageNum,
      pageSize,
      results: paged,
    });
  } catch (err: any) {
    console.error("RSS Fetch Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch cybersecurity news." });
  }
}
