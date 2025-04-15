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

const tagMap: Record<string, string> = {
  // Threat types
  "ransomware": "Ransomware",
  "malware": "Malware",
  "phishing": "Phishing",
  "zero-day": "Zero-Day",
  "exploit": "Exploit",
  "backdoor": "Backdoor",
  "rootkit": "Rootkit",
  "ddos": "DDoS",
  "breach": "Data Breach",
  "cve": "CVE",
  "vulnerability": "Vulnerability",
  "patch": "Patch",
  "Critical": "CRITICAL",

  // Nation-states
  "china": "China",
  "russia": "Russia",
  "iran": "Iran",
  "north korea": "North Korea",
  "apt": "APT",

  // Sectors
  "hospital": "Healthcare",
  "clinic": "Healthcare",
  "healthcare": "Healthcare",
  "school": "Education",
  "university": "Education",
  "education": "Education",
  "government": "Government",
  "municipality": "Municipality",
  "infrastructure": "Infrastructure",

  // Regional
  "chicago": "Chicago",
  "illinois": "Illinois",
  "us": "United States",
  "america": "United States",
  "nato": "NATO",
};

function filterRelevantItems(items: any[], source: string, sourceTitle = "Unknown Source") {
  return items
    .filter((item) => {
      const content = `${item.title || ""} ${item.contentSnippet || item.content || ""}`.toLowerCase();
      return Object.keys(tagMap).some((kw) => content.includes(kw));
    })
    .map((item) => {
      const content = `${item.title || ""} ${item.contentSnippet || item.content || ""}`.toLowerCase();

      const matchedTags = Array.from(
        new Set(
          Object.entries(tagMap)
            .filter(([kw]) => content.includes(kw))
            .map(([, tag]) => tag)
        )
      );

      return {
        title: item.title,
        description: item.contentSnippet || item.content || "",
        date: item.isoDate || item.pubDate || "",
        link: item.link,
        tags: matchedTags,
        source: sourceTitle,
      };
    });
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
      new Map(
        filtered
          .filter(item => item.date && !isNaN(new Date(item.date).getTime()))
          .map(item => [item.link, item])
      ).values()
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
