export const config = {
  runtime: "edge",
};

const BASE_URL = "https://api.ransomware.live/v2";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "countryvictims";
  const country = url.searchParams.get("country") || "US";

  // CORS headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    switch (type) {
      case "recentvictims": {
        const res = await fetch(
          `${BASE_URL}/recentvictims`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch recent victims: ${res.status}`);
        }
        const victims = await res.json();
        return new Response(JSON.stringify(victims), {
          status: 200,
          headers: defaultHeaders,
        });
      }

      case "combined":
      case "countryvictims": {
        const res = await fetch(
          `${BASE_URL}/countryvictims/${encodeURIComponent(country)}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) {
          throw new Error(
            `Failed to fetch country victims (${country}): ${res.status}`
          );
        }
        const victims: any[] = await res.json();

        // Aggregate sector counts
        const sectorsMap: Record<string, number> = {};
        for (const v of victims) {
          const sector = v.activity || "Unknown";
          sectorsMap[sector] = (sectorsMap[sector] || 0) + 1;
        }
        const sectors = Object.entries(sectorsMap)
          .map(([sector, count]) => ({ sector, count }))
          .sort((a, b) => b.count - a.count);

        return new Response(
          JSON.stringify({ victims, sectors }),
          { status: 200, headers: defaultHeaders }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ error: `Invalid type: ${type}` }),
          { status: 400, headers: defaultHeaders }
        );
      }
    }
  } catch (err: any) {
    console.error("Ransomware API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: defaultHeaders,
    });
  }
}
