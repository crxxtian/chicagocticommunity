import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import Modal from "@/components/Modal"; // Modal Component for Detailed View
import ReactMarkdown from "react-markdown";

type Victim = {
  victim: string;
  group: string;
  attackdate: string;
  country: string;
  activity: string;
  claim_url: string;
};

type ThreatActor = {
  title: string;
  content: string;
};

export default function Research() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorDetails, setActorDetails] = useState<ThreatActor | null>(null);

  const modalContent: Record<string, ThreatActor> = {
    RansomHouse: {
      title: "RansomHouse",
      content: `**RansomHouse** claimed responsibility for the March 2025 breach of Loretto Hospital in Chicago, stealing 1.5TB of sensitive medical data.

RansomHouse primarily conducts data exfiltration attacks rather than using traditional ransomware. Their tactics have led them to target healthcare organizations like Loretto Hospital in Chicago. The group demands payment for not leaking stolen data.

### Indicators of Compromise (IOCs)
**Hashes:**
- SHA256: 2C1475F1B49A8B93A6C6217BE078392925535E084048BF04241E57A711F0F58E
- SHA256: 549A8BC04C0EA9C622BAC90B0607E3F4FD48CB5610601031E054CC622BAC90B0607E3F4FD48CB5610601031E054CC6340F8EBA5

**URLs:**
- \`XW7AU5PNWTL6LOZBSUDKMYD32N6GNQDNGITJDPPYBUDAN3X3PJGPMPID[.]ONION\`
- \`HXXP[:]//ZZF6L4WAVAYC2MVBZWETTBLCO2QODVE5SECTJQYWC6FUWKVCVJLUAMYD[.]ONION\`

**File Extensions:**
- .XVGV, .dump, .vab, .backup, .dmp

**Ransom Notes:**
- HowToRestore.txt

### Tactics, Techniques, and Procedures (TTPs)
- Exploits vulnerabilities, uses Mimikatz for credential dumping, and PowerShell for system discovery.`,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** remains one of the most active ransomware groups globally. Several manufacturing and logistics companies in the Midwest have been recent victims.

Known for using the **Ransomware-as-a-Service (RaaS)** model, LockBit attacks have affected multiple sectors. In the Midwest, LockBit targeted companies like CDW and government agencies in Illinois.

### Indicators of Compromise (IOCs)
**Command Line Parameters:**
- \`-del\`: Self-delete
- \`-gdel\`: Remove LockBit 3.0 group policy changes

**File Path Locations:**
- ADMIN$\\Temp\\<LockBit3.0 Filename>.exe
- %SystemRoot%\\Temp\\<LockBit3.0 Filename>.exe

**Registry Artifacts:**
- HKCU\\Control Panel\\Desktop\\WallPaper: (Default) C:\\ProgramData\\<Malware Extension>.bmp

**Mutex:**
- Global<MD4 hash of machine GUID>

### Tactics, Techniques, and Procedures (TTPs)
- Known for targeting critical infrastructure, leveraging advanced evasion techniques, and using tools like PowerShell.`,
    },
  };

  useEffect(() => {
    fetch("/api/ransomware")
      .then((res) => res.json())
      .then((data) => {
        const usOnly = data.filter((v: Victim) => v.country === "US");
        setVictims(usOnly.slice(0, 30));
      })
      .catch((err) => console.error("Failed to fetch ransomware data", err));
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter ? victims.filter((v) => v.activity === sectorFilter) : victims;

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
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">🕵️ Threat Actor Spotlights</h2>
          <p className="text-muted-foreground">
            A closer look at APT groups and ransomware gangs known to target critical sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(modalContent).map((actor) => (
            <div
              key={actor}
              className="border border-border p-4 rounded-md bg-muted/20 cursor-pointer"
              onClick={() => {
                setActorDetails(modalContent[actor]);
                setIsModalOpen(true);
              }}
            >
              <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                {modalContent[actor].title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {modalContent[actor].content.split("\n")[0]}
              </p>
              <Badge variant="secondary">{actor === "RansomHouse" ? "Healthcare" : "Manufacturing"}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-mono font-semibold">🎯 Recent Ransomware Activity</h2>
            <p className="text-muted-foreground">Live data pulled from Ransomware.live API</p>
          </div>

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
                <DropdownMenuItem key={sector} onClick={() => setSectorFilter(sector)}>
                  {sector}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {filteredVictims.map((v) => (
            <div key={v.victim} className="border border-border p-4 rounded-md bg-secondary/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-mono font-medium text-lg">{v.victim}</h3>
                <Badge variant="outline">{v.group}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Sector: <strong>{v.activity}</strong> • {v.attackdate}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a href={v.claim_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
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

      {actorDetails && (
        <Modal
          title={actorDetails.title}
          content={<ReactMarkdown>{actorDetails?.content}</ReactMarkdown>}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
