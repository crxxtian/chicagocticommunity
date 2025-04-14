export const config = {
  runtime: "edge", // tells Vercel to treat it as an Edge Function
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const apiResponse = await fetch("https://api.ransomware.live/v2/recentvictims", {
      headers: {
        "Accept": "application/json"
      }
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

    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Ransomware API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
