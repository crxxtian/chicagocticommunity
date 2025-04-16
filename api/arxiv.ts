export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    const searchTerms = ["cybersecurity", "APT", "cybercrime", "malware", "ransomware"];
    const maxPerQuery = 4;
  
    const fetchEntries = async (term: string) => {
      const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
        term
      )}&start=0&max_results=${maxPerQuery}&sortBy=submittedDate&sortOrder=descending`;
  
      const res = await fetch(url);
      const xml = await res.text();
  
      // Very lightweight manual parser using regex
      const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match) => {
        const entry = match[1];
  
        const getTag = (tag: string) =>
          entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`))?.[1]?.trim().replace(/\n/g, " ") ?? null;
  
        const linkMatch = entry.match(/<link.*?rel="alternate".*?href="(.*?)"/);
        const link = linkMatch?.[1] ?? null;
  
        return {
          title: getTag("title"),
          summary: getTag("summary"),
          link,
        };
      });
  
      return entries.filter((e) => e.title && e.summary && e.link);
    };
  
    try {
      const allResults = await Promise.all(searchTerms.map(fetchEntries));
      const flat = allResults.flat().slice(0, 12);
  
      return new Response(JSON.stringify(flat), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error: any) {
      console.error("arXiv fetch failed:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch arXiv data" }),
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
  