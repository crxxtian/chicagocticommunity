// Vercel Edge API Route (ESM compatible)
import Parser from "rss-parser";

const parser = new Parser();

export const config = {
  runtime: "edge", // Important for Vercel to handle correctly
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const sources = [
      "https://feeds.feedburner.com/TheHackersNews",
      "https://www.bleepingcomputer.com/feed/",
      "https://www.govtech.com/rss/category/cybersecurity.rss",
      "https://www.cisa.gov/news.xml"
    ];

    const keywords = ["Chicago", "Illinois", "Midwest", "cyber", "breach", "attack"];
    let items: any[] = [];

    for (const url of sources) {
      const feed = await parser.parseURL(url);
      items.push(...(feed.items ?? []));
    }

    const filtered = items.filter((item) => {
      const content = `${item.title ?? ""} ${item.contentSnippet ?? ""}`.toLowerCase();
      return keywords.some((kw) => content.includes(kw.toLowerCase()));
    });

    const simplified = filtered.slice(0, 20).map((item) => ({
      title: item.title,
      description: item.contentSnippet || "",
      date: item.pubDate,
      link: item.link,
      category: item.categories?.[0] || "General",
    }));

    return new Response(JSON.stringify(simplified), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("API error:", err);

    return new Response(
      JSON.stringify({ error: "Failed to fetch or parse RSS feeds" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
