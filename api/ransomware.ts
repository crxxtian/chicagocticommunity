export const config = {
  runtime: "edge", // tells Vercel this is an Edge Function (ESM compatible)
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const res = await fetch("https://api.ransomware.live/v2/recentvictims");

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch ransomware data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("ransomware API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
