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
      content: `**RansomHouse** claimed responsibility for the March 2025 breach of Loretto Hospital in Chicago, stealing 1.5TB of sensitive medical data.

RansomHouse conducts data exfiltration attacks and targets healthcare orgs like Loretto Hospital. The group demands payment for not leaking data.

**IOCs**
- \`.XVGV\`, \`.dump\`, \`.backup\`
- **Ransom Note**: HowToRestore.txt
- **TTPs**: Mimikatz, credential dumping, PowerShell system discovery.`,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** remains one of the most active ransomware groups globally. Several manufacturing and logistics companies in the Midwest have been recent victims.

Known for its **Ransomware-as-a-Service (RaaS)** model, LockBit has attacked CDW and Illinois state agencies.

**IOCs**
- ` + "`-del`" + `, ` + "`-gdel`" + ` flags
- Registry: ` + "`HKCU\\Control Panel\\Desktop\\WallPaper`"
      },
  };

  useEffect(() => {
    fetch("/api/ransomware?type=recentvictims&country=US")
      .then((res) => res.json())
      .then((data) => {
        setVictims(data.slice(0, 30));
      })
      .catch((err) => console.error("Victim fetch failed", err));

    fetch("/api/ransomware?type=certs&country=US")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
          ? data.filter((team: any) => team.email && team.url)
          : [];
        setCerts(list.slice(0, 16));
      });

    fetch("/api/arxiv?query=cybersecurity")
      .then((res) => res.json())
      .then((data) => {
        setPapers(data.slice(0, 8));
      });
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter ? victims.filter((v) => v.activity === sectorFilter) : victims;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Ongoing investigation into threat actors, ransomware groups, and targeted campaigns affecting Illinois, the Midwest, and critical U.S. sectors.
        </p>
      </motion.div>

      {/* Actor Spotlights */}
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

      {/* Research Papers */}
      <HomeSection title="Cybersecurity Research Papers" description="Explorations of advanced cybersecurity topics and community research.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50 space-y-2">
              <h3 className="font-mono font-medium text-base">{paper.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-5">{paper.summary}</p>
              <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-500">
                Read paper
              </a>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* Ransomware Activity */}
      <HomeSection title="Recent Ransomware Activity" description="Live data from API. Filtered for US-based victims.">
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
              <a href={v.claim_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline pt-1 block">
                View breach record
              </a>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* CERT Directory */}
      <HomeSection title="CERT/CSIRT Directory" description="Major U.S. incident response teams.">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {certs.map((team, i) => (
            <div key={i} className="border border-border p-4 rounded-md bg-secondary/50">
              <h3 className="font-mono font-medium text-base mb-1">{team.name}</h3>
              <a href={team.url} className="text-sm text-blue-500 underline break-words" target="_blank" rel="noopener noreferrer">
                {team.url}
              </a>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* Modal */}
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
