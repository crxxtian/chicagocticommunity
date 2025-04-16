export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    const query = encodeURIComponent("cybersecurity");
    const url = `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending`;
  
    try {
      const res = await fetch(url);
      const xml = await res.text();
  
      const decode = (text: string) =>
        text
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
  
      const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match) => {
        const entry = match[1];
  
        const extract = (tag: string) => {
          const match = entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
          return match ? decode(match[1].trim()) : null;
        };
  
        const link = entry.match(/<link[^>]+rel="alternate"[^>]+href="([^"]+)"/)?.[1] ?? null;
  
        return {
          title: extract("title"),
          summary: extract("summary"),
          link,
        };
      });
  
      const filtered = entries.filter((e) => e?.title && e?.summary && e?.link).slice(0, 8);
  
      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err: any) {
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
  