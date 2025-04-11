export const config = {
  runtime: "edge", // Required for Vercel Edge Functions
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const response = await fetch("https://api.ransomware.live/v2/recentvictims");

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch ransomware data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
