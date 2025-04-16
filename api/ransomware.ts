export const config = {
  runtime: "edge",
};

const BASE_URL = "https://api.ransomware.live/v2";

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "recentvictims";
  const country = url.searchParams.get("country") || "US";
  const group = url.searchParams.get("group");
  const sector = url.searchParams.get("sector");
  const year = url.searchParams.get("year");

  const endpoint = getEndpoint(type, { country, group, sector, year });

  try {
    // If asking for sectors + victims, fetch both in parallel
    if (type === "combined") {
      const [victimsRes, sectorsRes] = await Promise.all([
        fetch(`${BASE_URL}/countryvictims/${country}`, {
          headers: { Accept: "application/json" },
        }),
        fetch(`${BASE_URL}/sectors`, {
          headers: { Accept: "application/json" },
        }),
      ]);

      if (!victimsRes.ok || !sectorsRes.ok) {
        return errorResponse("Failed to fetch victims or sector data", 500);
      }

      const victims = await victimsRes.json();
      const sectors = await sectorsRes.json();

      return successResponse({ victims, sectors });
    }

    // Otherwise, just one endpoint
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return errorResponse("Failed to fetch ransomware data", res.status);
    }

    const raw = await res.json();
    const data = Array.isArray(raw) ? raw : raw?.victims || raw?.data || raw;

    return successResponse(data);
  } catch (err: any) {
    console.error("Ransomware API error:", err);
    return errorResponse(err.message || "Internal Server Error", 500);
  }
}

function getEndpoint(
  type: string,
  opts: { country: string; group?: string; sector?: string; year?: string }
): string {
  switch (type) {
    case "recentvictims":
      return `${BASE_URL}/countryvictims/${opts.country}`;
    case "cyberattacks":
      return `${BASE_URL}/recentcyberattacks`;
    case "certs":
      return `${BASE_URL}/certs/${opts.country}`;
    case "groups":
      return `${BASE_URL}/groups`;
    case "groupvictims":
      return `${BASE_URL}/groupvictims/${encodeURIComponent(opts.group || "")}`;
    case "sectorvictims":
      return opts.country
        ? `${BASE_URL}/sectorvictims/${encodeURIComponent(opts.sector || "")}/${opts.country}`
        : `${BASE_URL}/sectorvictims/${encodeURIComponent(opts.sector || "")}`;
    case "history":
      return opts.year
        ? `${BASE_URL}/victims/${opts.year}`
        : `${BASE_URL}/victims/2024`;
    default:
      return `${BASE_URL}/recentvictims`;
  }
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function errorResponse(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
