"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeSection } from "@/components/HomeSection";
import Modal from "@/components/Modal";
import ReactMarkdown from "react-markdown";
import RP_Card from "@/components/RP_Card";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  tags?: string[];
};

type SectorStat = {
  sector: string;
  count: number;
};

const tagKeywords: Record<string, string[]> = {
  cybersecurity: ["cybersecurity", "cyber security", "cyber"],
  ml: ["machine learning", "ml"],
  ai: ["artificial intelligence", "ai"],
  llm: ["large language model", "llm"],
  privacy: ["privacy", "private", "confidentiality"],
  iot: ["internet of things", "iot"],
  ethics: ["ethics", "bias", "responsibility"],
  blockchain: ["blockchain"],
  malware: ["malware", "ransomware", "virus"],
  phishing: ["phishing", "social engineering"],
  vulnerability: ["vulnerability", "exploit", "cve"],
  dataset: ["dataset", "corpus", "benchmark"],
};

function extractTags(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const tags = new Set<string>();
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        tags.add(tag);
        break;
      }
    }
  }
  return Array.from(tags);
}

export default function Research() {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStat[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorDetails, setActorDetails] = useState<ThreatActor | null>(null);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);

  const modalContent: Record<string, ThreatActor> = {
    RansomHouse: {
      title: "RansomHouse",
      content: `**RansomHouse** is an extortion group known for stealing sensitive data without necessarily encrypting systems.\n\nIn March 2025, RansomHouse claimed responsibility for breaching **Loretto Hospital** in Chicago, stealing **1.5TB** of patient and administrative data.`,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** is one of the most active RaaS (Ransomware-as-a-Service) operations globally.\n\nIt has targeted **CDW**, **Illinois state agencies**, and several logistics and manufacturing companies in the Midwest.`,
    },
  };

  useEffect(() => {
    fetch("/api/ransomware?type=combined&country=US")
      .then((res) => res.json())
      .then((data) => {
        const victimsData = Array.isArray(data.victims)
          ? data.victims.filter((v: Victim) => v.activity && v.activity !== "Not Found")
          : [];
        setVictims(victimsData.slice(0, 30));

        const sectorList = Object.entries(data.sectors || {})
          .map(([sector, count]) => ({ sector, count: Number(count) }))
          .filter((s) => s.sector && s.sector !== "Not Found" && s.count > 0)
          .sort((a, b) => b.count - a.count);
        setSectorStats(sectorList.slice(0, 12));
      })
      .catch((err) => console.error("Combined fetch failed", err));

    fetch("/api/arxiv")
      .then((res) => res.json())
      .then((data) => {
        const valid = Array.isArray(data)
          ? data
              .filter((d) => d.title && d.summary && d.link)
              .map((d) => ({ ...d, tags: extractTags(d.title, d.summary) }))
          : [];
        setPapers(valid.slice(0, 8));
      })
      .catch((err) => console.error("arXiv fetch failed", err));
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter
    ? victims.filter((v) => v.activity === sectorFilter)
    : victims;

  const doughnutChartData = {
    labels: sectorStats.map((s) => s.sector),
    datasets: [
      {
        label: "Victim Count",
        data: sectorStats.map((s) => s.count),
        backgroundColor: [
          "#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa",
          "#a78bfa", "#f472b6", "#38bdf8", "#34d399", "#c084fc",
          "#fde68a", "#a3e635",
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#d1d5db",
          font: { family: "monospace" },
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db",
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw} victims`,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Investigating threat actors, ransomware campaigns, and ongoing breaches with a focus on Illinois, the Midwest, and North America.
        </p>
      </motion.div>

      <HomeSection title="Threat Actor Spotlights">
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

      {papers.length > 0 && (
        <HomeSection title="Latest Research Papers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map((paper, i) => (
              <RP_Card
                key={i}
                title={paper.title}
                summary={paper.summary}
                link={paper.link}
                tags={paper.tags}
              />
            ))}
          </div>
        </HomeSection>
      )}

      {victims.length > 0 && (
        <HomeSection title="Recent Ransomware Activity">
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
              <div key={`${v.victim}-${v.attackdate}`} className="border border-border p-4 rounded-md bg-background/40">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-mono font-medium text-lg break-words">{v.victim || "Unknown Victim"}</h3>
                  <Badge variant="outline">{v.group}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sector: <strong>{v.activity || "Unknown"}</strong> • {v.attackdate}
                </p>
                {v.claim_url && (
                  <a
                    href={v.claim_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 underline pt-1 block"
                  >
                    View breach record
                  </a>
                )}
              </div>
            ))}
          </div>
        </HomeSection>
      )}

      {sectorStats.length > 0 && (
        <HomeSection title="Top Targeted Sectors">
          <div className="bg-muted/10 p-6 rounded-lg border flex justify-center items-center">
            <div className="w-full max-w-md sm:max-w-lg">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </div>
        </HomeSection>
      )}

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
