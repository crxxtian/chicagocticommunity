// /api/ransomware.ts
export default async function handler(req: any, res: any) {
    try {
      const apiRes = await fetch("https://api.ransomware.live/v2/recentvictims");
      const data = await apiRes.json();
  
      res.setHeader("Access-Control-Allow-Origin", "*"); // Optional CORS for public
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch from ransomware.live" });
    }
  }
  