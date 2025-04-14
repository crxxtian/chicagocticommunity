export default async function handler(req: Request): Promise<Response> {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing NEWSAPI_KEY environment variable" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const query = "cybersecurity OR ransomware OR data breach OR hacking";
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    const data = await apiRes.json();

    const simplified = (data.articles || []).map((item: any) => ({
      title: item.title,
      description: item.description,
      date: item.publishedAt,
      link: item.url,
      category: item.source.name,
    }));

    return new Response(JSON.stringify(simplified), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=3600",
      },
    });
  } catch (err: any) {
    console.error("News API error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
