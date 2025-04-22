// app/research/page.tsx (or pages/research.tsx)

"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Filter, ShieldAlert } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { ChartOptions } from "chart.js";
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
ChartJS.register(ArcElement, Tooltip, Legend);

// dynamically import the chart wrapper
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

type Victim = {
  victim: string;
  group: string;
  attackdate: string;
  country: string;
  activity: string;
  claim_url?: string;
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
    for (const kw of keywords) {
      if (text.includes(kw)) {
        tags.add(tag);
        break;
      }
    }
  }
  return Array.from(tags);
}

function fmtDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy • h:mm a");
  } catch {
    return iso;
  }
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
      content: `**RansomHouse** is an extortion group known for stealing sensitive data without necessarily encrypting systems.

In March 2025, RansomHouse claimed responsibility for breaching **Loretto Hospital** in Chicago, stealing **1.5TB** of patient and administrative data.`,
    },
    LockBit: {
      title: "LockBit",
      content: `**LockBit** is one of the most active RaaS (Ransomware-as-a-Service) operations globally.

It has targeted **CDW**, **Illinois state agencies**, and several logistics and manufacturing companies in the Midwest.`,
    },
  };

  useEffect(() => {
    fetch("/api/ransomware?type=combined&country=US")
      .then((res) => res.json())
      .then((data) => {
        const vs = Array.isArray(data.victims)
          ? data.victims.filter((v: Victim) => v.activity && v.activity !== "Not Found")
          : [];
        setVictims(vs.slice(0, 30));

        const stats = Object.entries(data.sectors || {})
          .map(([sector, count]) => ({ sector, count: Number(count) }))
          .filter((s) => s.sector && s.count > 0)
          .sort((a, b) => b.count - a.count);
        setSectorStats(stats.slice(0, 12));
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

  const uniqueSectors = useMemo(
    () => Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean),
    [victims]
  );
  const filteredVictims = sectorFilter
    ? victims.filter((v) => v.activity === sectorFilter)
    : victims;

  const doughnutChartData = useMemo(
    () => ({
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
    }),
    [sectorStats]
  );

  const doughnutOptions: ChartOptions<"doughnut"> = {
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
          label: (ctx) => `${ctx.label}: ${ctx.raw} victims`,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Investigating threat actors, ransomware campaigns, and ongoing breaches across North America.
        </p>
      </motion.div>

      <HomeSection title="Threat Actor Spotlights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(modalContent).map((actor) => (
            <div
              key={actor.title}
              className="border border-border p-4 rounded-lg bg-muted/20 hover:bg-muted/30 cursor-pointer transition"
              onClick={() => {
                setActorDetails(actor);
                setIsModalOpen(true);
              }}
            >
              <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                {actor.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {actor.content.replace(/\n/g, " ").slice(0, 80)}...
              </p>
              <Badge variant="secondary">
                {actor.title === "RansomHouse" ? "Healthcare" : "Manufacturing"}
              </Badge>
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

      {filteredVictims.length > 0 && (
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
                <DropdownMenuItem onClick={() => setSectorFilter(null)}>
                  All Sectors
                </DropdownMenuItem>
                {uniqueSectors.map((sec) => (
                  <DropdownMenuItem key={sec} onClick={() => setSectorFilter(sec)}>
                    {sec}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            {filteredVictims.map((v) => (
              <div
                key={`${v.victim}-${v.attackdate}`}
                className="border border-border p-4 rounded-md bg-background/40"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-mono font-medium text-lg break-words">
                    {v.victim || "Unknown Victim"}
                  </h4>
                  <Badge variant="outline">{v.group}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sector: <strong>{v.activity || "Unknown"}</strong> • {fmtDate(v.attackdate)}
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