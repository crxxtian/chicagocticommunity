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
    const maxResults = 12;
  
    // Combine search terms using OR operator
    const combinedQuery = searchTerms.map(term => `all:${term}`).join('+OR+');
    const encodedQuery = encodeURIComponent(combinedQuery);
    const url = `https://export.arxiv.org/api/query?search_query=${encodedQuery}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`arXiv API responded with status ${res.status}`);
      }
      const xml = await res.text();
      const parser = new DOMParser();
      const feed = parser.parseFromString(xml, "application/xml");
  
      const entries = Array.from(feed.getElementsByTagName("entry")).map((entry) => {
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
  
      return new Response(JSON.stringify(entries), {
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
  