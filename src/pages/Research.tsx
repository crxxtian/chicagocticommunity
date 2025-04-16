"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HomeSection } from "@/components/HomeSection";
import Modal from "@/components/Modal";
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

type ArxivPaper = {
  title: string;
  summary: string;
  link: string;
};

type CertTeam = {
  name: string;
  url: string;
};

export default function Research() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorDetails, setActorDetails] = useState<ThreatActor | null>(null);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [certs, setCerts] = useState<CertTeam[]>([]);

  const modalContent: Record<string, ThreatActor> = {
    RansomHouse: {
      title: "RansomHouse",
      content: `**RansomHouse** is an extortion group known for stealing sensitive data without necessarily encrypting systems.

In March 2025, RansomHouse claimed responsibility for breaching **Loretto Hospital** in Chicago, stealing **1.5TB** of patient and administrative data.

### Key TTPs
- Double-extortion without ransomware deployment
- Data leak sites on darknet (.onion)

### IOCs
- File Extensions: \`.XVGV\`, \`.dump\`, \`.backup\`
- Ransom Notes: *HowToRestore.txt*
- Tools: Mimikatz, PowerShell discovery
- Leak site: \`xw7au5p...onion\`
`,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** is one of the most active RaaS (Ransomware-as-a-Service) operations globally.

It has targeted **CDW**, **Illinois state agencies**, and several logistics and manufacturing companies in the Midwest.

### Key TTPs
- RaaS model with LockBit 3.0 and custom builds
- Use of group policy tampering and self-delete flags

### IOCs
- Flags: \`-del\`, \`-gdel\`
- Registry: \`HKCU\\Control Panel\\Desktop\\WallPaper\`
- Mutex: \`Global<hash>\`
- File Drop Paths: \`ADMIN$\\Temp\\\`, \`%SystemRoot%\\Temp\\\``,
    },
  };

  useEffect(() => {
    fetch("/api/ransomware?type=recentvictims&country=US")
      .then((res) => res.json())
      .then((data) => setVictims(data.slice(0, 30)))
      .catch((err) => console.error("Victim fetch failed", err));

    fetch("/api/ransomware?type=certs&country=US")
      .then((res) => res.json())
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter((team: any) => team.name && team.url)
          : [];
        setCerts(filtered.slice(0, 20));
      });

    fetch("/api/arxiv?query=cybersecurity")
      .then((res) => res.json())
      .then((data) => setPapers(data.slice(0, 8)))
      .catch((err) => console.error("arXiv fetch failed", err));
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter ? victims.filter((v) => v.activity === sectorFilter) : victims;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Investigating threat actors, ransomware campaigns, and ongoing breaches with a focus on Illinois, the Midwest, and North America.
        </p>
      </motion.div>

      <HomeSection title="Threat Actor Spotlights" linkTo="#">
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
      </HomeSection>

      <HomeSection title="Cybersecurity Research Papers" linkTo="#">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50 space-y-2">
              <h3 className="font-mono font-medium text-base">{paper.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-5">{paper.summary}</p>
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-blue-500"
              >
                Read full paper
              </a>
            </div>
          ))}
        </div>
      </HomeSection>

      <HomeSection title="Recent Ransomware Activity" linkTo="#">
        <div className="mb-4 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                {sectorFilter || "Filter Sector"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSectorFilter(null)}>All Sectors</DropdownMenuItem>
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
            <div key={v.victim + v.attackdate} className="border border-border p-4 rounded-md bg-background/40">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-mono font-medium">{v.victim}</h3>
                <Badge variant="outline">{v.group}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Sector: <strong>{v.activity || "Unknown"}</strong> • {v.attackdate}
              </p>
              <a
                href={v.claim_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 underline pt-1 block"
              >
                View breach record
              </a>
            </div>
          ))}
        </div>
      </HomeSection>

      <HomeSection title="CERT/CSIRT Directory" linkTo="#">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {certs.map((team, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50">
              <h3 className="font-mono font-medium text-base mb-1">{team.name}</h3>
              <a
                href={team.url}
                className="text-sm text-blue-500 underline break-words"
                target="_blank"
                rel="noopener noreferrer"
              >
                {team.url}
              </a>
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
