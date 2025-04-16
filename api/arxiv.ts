export const config = {
    runtime: "edge",
  };
  
  export default async function handler(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "cybersecurity";
  
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
      query
    )}&start=0&max_results=10`;
  
    try {
      const response = await fetch(arxivUrl);
      const xml = await response.text();
  
      // Parse the Atom XML into a simple object
      const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((match) => {
        const entry = match[1];
  
        const getTag = (tag: string) =>
          entry.match(new RegExp(`<${tag}>(.*?)</${tag}>`))?.[1] || "No data";
  
        const getLink = () =>
          entry.match(/<link[^>]+href="(http[^"]+)"[^>]*rel="alternate"/)?.[1] || "";
  
        return {
          title: getTag("title").replace(/\n/g, " ").trim(),
          summary: getTag("summary").replace(/\n/g, " ").trim(),
          link: getLink(),
        };
      });
  
      return new Response(JSON.stringify(entries), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error: any) {
      console.error("Arxiv API Error:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch arXiv data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
  