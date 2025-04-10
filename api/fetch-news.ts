// /api/fetch-news.ts
import Parser from "rss-parser";
const parser = new Parser();

const sources = [
  "https://feeds.feedburner.com/TheHackersNews",
  "https://www.bleepingcomputer.com/feed/",
  "https://www.govtech.com/rss/category/cybersecurity.rss",
  "https://www.cisa.gov/news.xml"
];

const keywords = ["Chicago", "Illinois", "Midwest", "cyber", "breach", "attack"];

export default async function handler(req: any, res: any) {
  try {
    let items: any[] = [];

    for (const url of sources) {
      const feed = await parser.parseURL(url);
      items.push(...(feed.items ?? []));
    }

    const filtered = items.filter((item) => {
      const content = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw.toLowerCase()));
    });

    const simplified = filtered.slice(0, 20).map((item) => ({
      title: item.title,
      description: item.contentSnippet || "",
      date: item.pubDate,
      link: item.link,
      category: item.categories?.[0] || "General"
    }));

    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).json(simplified);
  } catch (err) {
    console.error("RSS Error:", err);
    res.status(500).json({ error: "Failed to fetch or parse RSS feeds" });
  }
}
