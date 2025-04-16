export const config = {
  runtime: "edge",
};

const BASE = "https://api.ransomware.live/v2";
const ALLOWED_COUNTRIES = ["US", "CA", "MX"];

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "recentvictims";
  const country = url.searchParams.get("country") || "US";
  const group = url.searchParams.get("group");
  const sector = url.searchParams.get("sector");
  const year = url.searchParams.get("year");

  const endpoint = getEndpoint(type, { country, group, sector, year });

  try {
    const apiResponse = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch ransomware data" }),
        {
          status: apiResponse.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const raw = await apiResponse.json();

    const result = Array.isArray(raw)
      ? raw
      : raw?.victims || raw?.data || raw;

    const filtered =
      (type === "recentvictims" || type === "history") && Array.isArray(result)
        ? result.filter((v: any) => ALLOWED_COUNTRIES.includes(v.country))
        : result;

    return new Response(JSON.stringify(filtered ?? []), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("Ransomware API error:", err);
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

function getEndpoint(
  type: string,
  opts: { country: string; group?: string; sector?: string; year?: string }
): string {
  switch (type) {
    case "recentvictims":
      return `${BASE}/countryvictims/${opts.country}`;
    case "cyberattacks":
      return `${BASE}/recentcyberattacks`;
    case "certs":
      return `${BASE}/certs/${opts.country}`;
    case "groups":
      return `${BASE}/groups`;
    case "groupvictims":
      return `${BASE}/groupvictims/${encodeURIComponent(opts.group || "")}`;
    case "sectorvictims":
      return opts.country
        ? `${BASE}/sectorvictims/${encodeURIComponent(opts.sector || "")}/${opts.country}`
        : `${BASE}/sectorvictims/${encodeURIComponent(opts.sector || "")}`;
    case "history":
      return opts.year
        ? `${BASE}/victims/${opts.year}`
        : `${BASE}/victims/2024`;
    default:
      return `${BASE}/recentvictims`;
  }
}
