import Parser from "rss-parser";

const parser = new Parser();

const sources = [
  "https://feeds.feedburner.com/TheHackersNews",
  "https://www.bleepingcomputer.com/feed/",
  "https://www.govtech.com/rss/category/cybersecurity.rss",
  "https://www.cisa.gov/news.xml",
];

const keywords = ["chicago", "illinois", "midwest", "cyber", "breach", "attack"];

export default async function handler(req: any, res: any) {
  try {
    let items: any[] = [];

    // Fetch & combine all feeds
    for (const url of sources) {
      const feed = await parser.parseURL(url);
      items.push(...(feed.items ?? []));
    }

    // Keyword filtering
    const filtered = items.filter((item) => {
      const content = `${item.title ?? ""} ${item.contentSnippet ?? ""}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw));
    });

    // Format output
    const simplified = filtered.slice(0, 20).map((item) => ({
      title: item.title,
      description: item.contentSnippet || "",
      date: item.pubDate,
      link: item.link,
      category: item.categories?.[0] || "General",
    }));

    // Send response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).json(simplified);
  } catch (err) {
    console.error("Fetch-News Error:", err);
    res.status(500).json({ error: "Failed to fetch or parse RSS feeds" });
  }
}
