export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    // Handle CORS preflight
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
  
    const query = encodeURIComponent("cat:cs.CR");
    const url = `https://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=8&sortBy=submittedDate&sortOrder=descending`;
  
    try {
      const res = await fetch(url);
      const xml = await res.text();
  
      const decode = (text: string) =>
        text
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, " ")
          .trim();
  
      const entries = Array.from(xml.matchAll(/<entry[\s\S]*?>[\s\S]*?<\/entry>/g)).map((match) => {
        const entry = match[0];
  
        const extract = (tag: string) => {
          const reg = new RegExp(`<${tag}.*?>([\\s\\S]*?)<\/${tag}>`, "i");
          const m = entry.match(reg);
          return m ? decode(m[1]) : null;
        };
  
        const link =
          entry.match(/<link[^>]+rel="alternate"[^>]+href="([^"]+)"/)?.[1] ?? null;
  
        return {
          title: extract("title"),
          summary: extract("summary"),
          link,
        };
      });
  
      const filtered = entries.filter((e) => e.title && e.summary && e.link).slice(0, 8);
  
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
  