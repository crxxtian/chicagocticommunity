export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    const searchTerms = ["cybersecurity", "APT", "cybercrime", "malware", "ransomware"];
    const maxPerQuery = 5;
  
    const fetchEntries = async (term: string) => {
      const query = encodeURIComponent(term);
      const url = `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=${maxPerQuery}`;
      
      const res = await fetch(url);
      const xml = await res.text();
  
      return Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match) => {
        const entry = match[1];
  
        const getTag = (tag: string) =>
          entry.match(new RegExp(`<${tag}>(.*?)</${tag}>`))?.[1].replace(/\n/g, " ").trim() || null;
  
        const link =
          entry.match(/<link[^>]+href="(http[^"]+)"[^>]*rel="alternate"/)?.[1] || null;
  
        return {
          title: getTag("title"),
          summary: getTag("summary"),
          link,
        };
      }).filter((entry) => entry.title && entry.summary && entry.link);
    };
  
    try {
      const allResults = await Promise.all(searchTerms.map(fetchEntries));
      const flat = allResults.flat().slice(0, 12); // limit total results
  
      return new Response(JSON.stringify(flat), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error: any) {
      console.error("arXiv fetch failed", error);
      return new Response(JSON.stringify({ error: "Failed to fetch arXiv data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
  