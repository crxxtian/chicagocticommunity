export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    const searchTerms = [
      'cybersecurity',
      'APT',
      'cybercrime',
      'malware',
      'ransomware',
    ];
    const maxPerQuery = 4;
  
    const fetchEntries = async (term: string) => {
      const query = encodeURIComponent(term);
      const url = `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=${maxPerQuery}&sortBy=submittedDate&sortOrder=descending`;
  
      const res = await fetch(url);
      const xml = await res.text();
      const parser = new DOMParser();
      const feed = parser.parseFromString(xml, "application/xml");
  
      return Array.from(feed.getElementsByTagName("entry")).map((entry) => {
        const getText = (tag: string) =>
          entry.getElementsByTagName(tag)?.[0]?.textContent?.trim() ?? null;
  
        const linkNode = Array.from(entry.getElementsByTagName("link")).find(
          (el) => el.getAttribute("rel") === "alternate"
        );
        const link = linkNode?.getAttribute("href") ?? null;
  
        return {
          title: getText("title"),
          summary: getText("summary"),
          link,
        };
      }).filter((entry) => entry.title && entry.summary && entry.link);
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
  