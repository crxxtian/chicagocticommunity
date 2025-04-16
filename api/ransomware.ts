export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const [victimsRes, sectorsRes] = await Promise.all([
      fetch("https://api.ransomware.live/v2/recentvictims", {
        headers: { Accept: "application/json" },
      }),
      fetch("https://api.ransomware.live/v2/sectors", {
        headers: { Accept: "application/json" },
      }),
    ]);

    if (!victimsRes.ok || !sectorsRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch ransomware or sector data",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const victims = await victimsRes.json();
    const sectors = await sectorsRes.json();

    return new Response(
      JSON.stringify({
        victims,
        sectors,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    console.error("Ransomware API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
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
