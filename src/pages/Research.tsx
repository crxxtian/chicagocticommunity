import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Filter, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/Modal"; // Your Modal component for detailed view
import ReactMarkdown from "react-markdown";
import { HomeSection } from "@/components/HomeSection";

type Victim = {
  victim: string;
  group: string;
  attackdate: string;
  country: string;
  activity: string;
  claim_url: string;
};

type CyberAttack = {
  title: string;
  description: string;
  date: string;
  source: string;
};

type CertInfo = {
  name: string;
  website: string;
  email: string;
};

type RansomwareGroup = {
  name: string;
  description: string;
  first_seen: string;
};

type ArxivPaper = {
  id: string;
  title: string;
  summary: string;
  link: string;
};

type ThreatActor = {
  title: string;
  content: string;
};

export default function Research() {
  // States for various data
  const [victims, setVictims] = useState<Victim[]>([]);
  const [cyberAttacks, setCyberAttacks] = useState<CyberAttack[]>([]);
  const [certInfo, setCertInfo] = useState<CertInfo[]>([]);
  const [ransomwareGroups, setRansomwareGroups] = useState<RansomwareGroup[]>([]);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorDetails, setActorDetails] = useState<ThreatActor | null>(null);

  // Custom threat actor spotlight content
  const modalContent: Record<string, ThreatActor> = {
    RansomHouse: {
      title: "RansomHouse",
      content: `**RansomHouse** claimed responsibility for the March 2025 breach of Loretto Hospital in Chicago, stealing 1.5TB of sensitive medical data.

They primarily conduct data exfiltration attacks rather than traditional ransomware. Their tactics have led them to target healthcare organizations. The group demands payment to avoid data leaks.

Indicators of Compromise (IOCs):
- Hashes: SHA256: 2C1475F1B49A8B93..., SHA256: 549A8BC04C0EA9C62...
- URLs: XW7AU5PN... (onion), HXXP://ZZF6L4...
- File extensions: .XVGV, .dump, .vab, .backup, .dmp
- Ransom Note: HowToRestore.txt

Tactics and Techniques:
- Exploits vulnerabilities, leverages Mimikatz for credential dumping, and uses PowerShell for system discovery.`,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** remains one of the most active ransomware groups globally. Several manufacturing and logistics companies in the Midwest have been affected.

Known for a Ransomware-as-a-Service model, LockBit has targeted multiple sectors in the region.

Indicators of Compromise (IOCs):
- Command line parameters: \`-del\` (self-delete), \`-gdel\` (remove group policy changes)
- File locations: ADMIN$\\Temp\\<LockBit3.0 Filename>.exe
- Registry artifacts: HKCU\\Control Panel\\Desktop\\WallPaper changes
- Mutex used: Global<MD4 hash of machine GUID>

Tactics:
- Focuses on targeting critical infrastructure and employs advanced evasion techniques.`,
    },
  };

  // Fetch recent victims from US only
  useEffect(() => {
    fetch("/api/ransomware?type=recentvictims&country=US")
      .then((res) => res.json())
      .then((data) => setVictims(data.slice(0, 30)))
      .catch((err) => console.error("Failed to fetch recent victims", err));
  }, []);

  // Fetch recent cyberattacks from press
  useEffect(() => {
    fetch("/api/ransomware?type=cyberattacks")
      .then((res) => res.json())
      .then((data) => setCyberAttacks(data.slice(0, 10)))
      .catch((err) => console.error("Failed to fetch cyberattacks", err));
  }, []);

  // Fetch CERT/CSIRT info for US
  useEffect(() => {
    fetch("/api/ransomware?type=certs&country=US")
      .then((res) => res.json())
      .then(setCertInfo)
      .catch((err) => console.error("Failed to fetch CERT info", err));
  }, []);

  // Fetch ransomware groups info
  useEffect(() => {
    fetch("/api/ransomware?type=groups")
      .then((res) => res.json())
      .then(setRansomwareGroups)
      .catch((err) => console.error("Failed to fetch groups", err));
  }, []);

  // Fetch arXiv research papers on cybersecurity
  useEffect(() => {
    fetch("https://export.arxiv.org/api/query?search_query=all:cybersecurity&start=0&max_results=5")
      .then((res) => res.text())
      .then((xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const entries = Array.from(xml.getElementsByTagName("entry"));
        const papersData: ArxivPaper[] = entries.map((entry) => ({
          id: entry.getElementsByTagName("id")[0]?.textContent || "",
          title: entry.getElementsByTagName("title")[0]?.textContent || "",
          summary: entry.getElementsByTagName("summary")[0]?.textContent || "",
          link: entry.getElementsByTagName("id")[0]?.textContent || "",
        }));
        setPapers(papersData);
      })
      .catch((err) => console.error("Failed to fetch arXiv papers", err));
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter ? victims.filter((v) => v.activity === sectorFilter) : victims;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore live threat activity, ransomware group trends, and cybersecurity research impacting North America.
        </p>
      </motion.div>

      {/* Threat Actor Spotlights */}
      <HomeSection title="Threat Actor Spotlights" linkTo="/research">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(modalContent).map((actor) => (
            <div
              key={actor}
              className="border border-border p-4 rounded-md bg-muted/20 cursor-pointer hover:bg-secondary/40 transition-colors"
              onClick={() => {
                setActorDetails(modalContent[actor]);
                setIsModalOpen(true);
              }}
            >
              <h3 className="font-mono font-medium text-lg mb-1">
                {modalContent[actor].title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {modalContent[actor].content.split("\n")[0]}
              </p>
              <Badge variant="secondary">
                {actor === "RansomHouse" ? "Healthcare" : "Manufacturing"}
              </Badge>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* Recent Ransomware Activity */}
      <HomeSection title="Recent Ransomware Activity" linkTo="/ransomware">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-mono font-semibold">Live Data from API</h2>
              <p className="text-muted-foreground">Filtered for US-based victims</p>
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
        </div>
      </HomeSection>

      {/* Cyberattacks */}
      <HomeSection title="Recent Cyberattacks" linkTo="/cyberattacks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cyberAttacks.map((attack, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50">
              <h3 className="font-mono font-medium text-lg mb-1">{attack.title}</h3>
              <p className="text-sm text-muted-foreground mb-1">{attack.description}</p>
              <p className="text-xs text-muted-foreground">{new Date(attack.date).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground italic">Source: {attack.source}</p>
              <div className="mt-2">
                <a href={attack.source} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                  More details
                </a>
              </div>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* CERT/CSIRT Directory */}
      <HomeSection title="CERT/CSIRT Directory" linkTo="/certs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certInfo.map((cert, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50">
              <h3 className="font-mono font-medium text-lg mb-1">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.email}</p>
              <p className="text-sm text-muted-foreground">{cert.website}</p>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* Ransomware Groups */}
      <HomeSection title="Ransomware Groups" linkTo="/groups">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ransomwareGroups.map((group, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50">
              <h3 className="font-mono font-medium text-lg mb-1">{group.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{group.description}</p>
              <p className="text-xs text-muted-foreground">{new Date(group.first_seen).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* arXiv Papers */}
      <HomeSection title="Cybersecurity Research Papers" linkTo="/papers">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50">
              <h3 className="font-mono font-medium text-lg mb-1">{paper.title}</h3>
              <p className="text-sm text-muted-foreground">{paper.summary}</p>
              <div className="mt-2">
                <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                  Read paper
                </a>
              </div>
            </div>
          ))}
        </div>
      </HomeSection>

      {actorDetails && (
        <Modal
          title={actorDetails.title}
          content={<ReactMarkdown>{actorDetails.content}</ReactMarkdown>}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
