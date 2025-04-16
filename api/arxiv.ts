import { xml2js } from "xml-js";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  const searchTerms = [
    "cybersecurity",
    "APT",
    "cybercrime",
    "malware",
    "ransomware",
  ];
  const maxResults = 12;
  const query = searchTerms.map((term) => `all:${term}`).join("+OR+");
  const url = `https://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status: ${res.status}`);

    const xml = await res.text();
    const json: any = xml2js(xml, { compact: true });

    const entries = json.feed.entry ?? [];
    const normalized = (Array.isArray(entries) ? entries : [entries]).map((e: any) => ({
      title: e.title?._text?.trim(),
      summary: e.summary?._text?.trim(),
      link:
        Array.isArray(e.link)
          ? e.link.find((l: any) => l._attributes?.rel === "alternate")?._attributes?.href
          : e.link?._attributes?.href,
    }));

    const filtered = normalized.filter((entry) => entry.title && entry.summary && entry.link);

    return new Response(JSON.stringify(filtered.slice(0, 12)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("arXiv fetch failed:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch arXiv data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
