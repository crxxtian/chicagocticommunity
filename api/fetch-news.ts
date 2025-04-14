import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

const parser = new Parser();

const sources = [
  "https://feeds.feedburner.com/TheHackersNews",
  "https://www.bleepingcomputer.com/feed/",
  "https://www.govtech.com/rss/category/cybersecurity.rss",
  "https://www.cisa.gov/news.xml",
];

const keywords = ["chicago", "illinois", "midwest", "cyber", "breach", "attack"];

type NewsItem = {
  title: string;
  description: string;
  date: string;
  link: string;
  category: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let items: any[] = [];

    // Fetch feeds in parallel
    const fetchPromises = sources.map((url) => parser.parseURL(url));
    const feeds = await Promise.allSettled(fetchPromises);

    for (const result of feeds) {
      if (result.status === "fulfilled" && result.value?.items) {
        items.push(...result.value.items);
      } else if (result.status === "rejected") {
        console.warn("Failed to fetch a feed:", result.reason); // TypeScript now knows `reason` exists
      }
    }

    // Keyword filtering
    const filtered = items.filter((item) => {
      const content = `${item.title ?? ""} ${item.contentSnippet ?? ""}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw));
    });

    // Format output
    const simplified: NewsItem[] = filtered.slice(0, 20).map((item) => ({
      title: item.title || "No Title",
      description: item.contentSnippet || "",
      date: item.pubDate || "",
      link: item.link || "",
      category: item.categories?.[0] || "General",
    }));

    // Send response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).json(simplified);
  } catch (err: any) {
    console.error("Fetch-News Error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch or parse RSS feeds", details: err.message });
  }
}