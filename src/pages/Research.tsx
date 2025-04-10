import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ShieldAlert, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Victim = {
  victim: string;
  group: string;
  attackdate: string;
  country: string;
  activity: string;
  claim_url: string;
};

export default function Research() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.ransomware.live/v2/recentvictims")
      .then((res) => res.json())
      .then((data) => {
        const usOnly = data.filter((v: Victim) => v.country === "US");
        setVictims(usOnly.slice(0, 30));
      })
      .catch((err) => console.error("Failed to fetch ransomware data", err));
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);

  const filteredVictims = sectorFilter
    ? victims.filter((v) => v.activity === sectorFilter)
    : victims;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Ongoing investigation into threat actors, ransomware groups, and targeted campaigns affecting Illinois, the Midwest, and critical U.S. sectors.
        </p>
      </motion.div>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-mono font-semibold">🎯 Recent Ransomware Activity</h2>
            <p className="text-muted-foreground">Live data pulled from Ransomware.live API</p>
          </div>

          {/* Sector Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                {sectorFilter || "Filter Sector"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSectorFilter(null)}>
                All Sectors
              </DropdownMenuItem>
              {uniqueSectors.map((sector) => (
                <DropdownMenuItem
                  key={sector}
                  onClick={() => setSectorFilter(sector)}
                >
                  {sector}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {filteredVictims.map((v) => (
            <div
              key={v.victim}
              className="border border-border p-4 rounded-md bg-secondary/50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-mono font-medium text-lg">{v.victim}</h3>
                <Badge variant="outline">{v.group}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Sector: <strong>{v.activity}</strong> • {v.attackdate}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={v.claim_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  View breach record
                </a>
                {v.claim_url?.includes(".onion") && (
                  <Badge variant="destructive" className="text-[11px]">
                    .onion link
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* Threat Actor Profiles */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">🕵️ Threat Actor Spotlights</h2>
          <p className="text-muted-foreground">
            A closer look at APT groups and ransomware gangs known to target critical sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border p-4 rounded-md bg-muted/20">
            <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              RansomHouse
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              RansomHouse claimed responsibility for the March 2025 breach of Loretto Hospital in Chicago, stealing 1.5TB of sensitive medical data.
            </p>
            <Badge variant="secondary">Healthcare</Badge>
          </div>

          <div className="border border-border p-4 rounded-md bg-muted/20">
            <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-yellow-500" />
              LockBit
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              LockBit remains one of the most active ransomware groups globally. Several manufacturing and logistics companies in the Midwest have been recent victims.
            </p>
            <Badge variant="secondary">Manufacturing</Badge>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* CTI Education */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">📚 What is Cyber Threat Intelligence?</h2>
        </div>
        <div className="space-y-4 text-muted-foreground max-w-2xl">
          <p>
            CTI is refined insight into cyber threats. Intelligence teams use credible insights from multiple sources to create actionable context on the threat landscape, threat actors and their tactics, techniques, and procedures (TTPs).
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Strategic CTI:</strong> Broad trends for leadership and investment planning.</li>
            <li><strong>Operational CTI:</strong> Alerts about impending or active threats.</li>
            <li><strong>Tactical CTI:</strong> TTP-level info for SOC teams and blue team defenders.</li>
          </ul>
          <p>
            The goal: shifting from reactive defense to proactive threat hunting and prevention.
          </p>
        </div>
      </section>
    </div>
  );
}
