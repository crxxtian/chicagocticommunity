import { XMLParser } from "fast-xml-parser";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const query = encodeURIComponent("cybersecurity");
  const url = `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=8&sortBy=submittedDate&sortOrder=descending`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true, 
    });

    const parsed = parser.parse(xml);
    const entries = parsed?.feed?.entry ?? [];

    const data = Array.isArray(entries)
      ? entries.map((entry: any) => {
          const link = Array.isArray(entry.link)
            ? entry.link.find((l: any) => l["@_rel"] === "alternate")?.["@_href"]
            : entry.link?.["@_href"] || null;

          return {
            title: entry.title ?? "No title",
            summary: entry.summary ?? "No summary",
            link,
          };
        })
      : [];

    const filtered = data.filter((e) => e.title && e.summary && e.link);

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("arXiv fetch failed", err);
    return new Response(JSON.stringify({ error: "Failed to fetch arXiv data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
