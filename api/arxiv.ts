export const config = {
    runtime: "edge",
  };
  
  const ARXIV_ENDPOINT = "https://export.arxiv.org/api/query";
  
  export default async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "cybersecurity";
    const max = url.searchParams.get("max") || "8";
    const start = url.searchParams.get("start") || "0";
  
    const queryURL = `${ARXIV_ENDPOINT}?search_query=all:${encodeURIComponent(
      search
    )}&start=${start}&max_results=${max}`;
  
    try {
      const arxivRes = await fetch(queryURL);
  
      if (!arxivRes.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch arXiv data" }),
          {
            status: arxivRes.status,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
  
      const xml = await arxivRes.text();
      const parsed = await parseArxiv(xml);
  
      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err: any) {
      console.error("arXiv API error:", err);
      return new Response(
        JSON.stringify({ error: err.message || "Internal Server Error" }),
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
  
  async function parseArxiv(xml: string): Promise<
    {
      id: string;
      title: string;
      summary: string;
      published: string;
      authors: string[];
      link: string;
      pdf: string | null;
    }[]
  > {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const entries = Array.from(doc.getElementsByTagName("entry"));
  
    return entries.map((entry) => {
      const getText = (tag: string) =>
        entry.getElementsByTagName(tag)?.[0]?.textContent || "";
  
      const authors = Array.from(entry.getElementsByTagName("author")).map(
        (a) => a.getElementsByTagName("name")?.[0]?.textContent || ""
      );
  
      const links = Array.from(entry.getElementsByTagName("link"));
      const pdf = links.find((l) => l.getAttribute("title") === "pdf")?.getAttribute("href") || null;
      const link = links.find((l) => l.getAttribute("rel") === "alternate")?.getAttribute("href") || "";
  
      return {
        id: getText("id"),
        title: getText("title").replace(/\s+/g, " ").trim(),
        summary: getText("summary").replace(/\s+/g, " ").trim(),
        published: getText("published"),
        authors,
        link,
        pdf,
      };
    });
  }
  