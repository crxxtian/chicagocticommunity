export default async function handler(req: Request, res: Response) {
  try {
    const response = await fetch("https://api.ransomware.live/v2/recentvictims");

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch ransomware data" });
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Necessary for Vercel Edge Runtime to properly resolve Response/Request types
type Request = {
  method: string;
};

type Response = {
  status: (code: number) => Response;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
};
