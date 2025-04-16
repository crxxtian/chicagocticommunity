export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    const keywords = ["cybersecurity", "APT", "cybercrime", "malware", "ransomware"];
    const booleanQuery = keywords.map((kw) => `all:${kw}`).join("+OR+");
  
    const url = `https://export.arxiv.org/api/query?search_query=${booleanQuery}&start=0&max_results=12&sortBy=submittedDate&sortOrder=descending`;
  
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/atom+xml" },
      });
  
      const xml = await res.text();
  
      const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map(
        (match) => {
          const entry = match[1];
  
          const getTag = (tag: string) =>
            entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? null;
  
          const link =
            entry.match(/<link[^>]*rel="alternate"[^>]*href="(.*?)"/)?.[1] ?? null;
  
          return {
            title: getTag("title"),
            summary: getTag("summary"),
            link,
          };
        }
      );
  
      const filtered = entries.filter((e) => e.title && e.summary && e.link);
  
      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err: any) {
      console.error("arXiv fetch failed:", err);
      return new Response(JSON.stringify({ error: "Failed to fetch arXiv data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
  