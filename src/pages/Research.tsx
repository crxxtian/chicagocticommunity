"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Filter, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
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

// Dynamically load to reduce bundle size
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

type SectorStat = {
  sector: string;
  count: number;
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

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetch<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let canceled = false;
    setState({ data: null, loading: true, error: null });
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<T>;
      })
      .then((data) => {
        if (!canceled) setState({ data, loading: false, error: null });
      })
      .catch((e) => {
        if (!canceled) setState({ data: null, loading: false, error: e.message });
      });
    return () => { canceled = true; };
  }, [url]);

  return state;
}

export default function Research() {
  const { toast } = useToast();

  // Fetch victims + sectors
  const {
    data: combinedData,
    loading: loadingVictims,
    error: victimsError,
  } = useFetch<{ victims: Victim[]; sectors: Record<string, number> }>(
    "/api/ransomware?type=combined&country=US"
  );

  // Fetch arXiv papers
  const {
    data: papers,
    loading: loadingPapers,
    error: papersError,
  } = useFetch<ArxivPaper[]>("/api/arxiv");

  // Show errors
  useEffect(() => {
    if (victimsError)
      toast({ variant: "destructive", title: "Error loading victims", description: victimsError });
    if (papersError)
      toast({ variant: "destructive", title: "Error loading papers", description: papersError });
  }, [victimsError, papersError, toast]);

  // Derive victims and sectors
  const victims = useMemo(() => combinedData?.victims || [], [combinedData]);
  const sectorStats = useMemo(() => {
    if (!combinedData) return [];
    return Object.entries(combinedData.sectors)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [combinedData]);

  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<ThreatActor | null>(null);

  const uniqueSectors = useMemo(
    () => Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean),
    [victims]
  );

  const filteredVictims = useMemo(
    () => (sectorFilter ? victims.filter((v) => v.activity === sectorFilter) : victims),
    [victims, sectorFilter]
  );

  const doughnutData = useMemo(
    () => ({
      labels: sectorStats.map((s) => s.sector),
      datasets: [{ data: sectorStats.map((s) => s.count), borderWidth: 0 }],
    }),
    [sectorStats]
  );

  // Static actor details
  const actorDetailsMap: Record<string, ThreatActor> = {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Investigating threat actors, ransomware campaigns, and ongoing breaches across North America.
        </p>
      </motion.div>

      {/* Threat Actor Spotlights */}
      <HomeSection title="Threat Actor Spotlights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(actorDetailsMap).map((actor) => (
            <div
              key={actor.title}
              className="border border-border p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition cursor-pointer"
              onClick={() => setModalContent(actor)}
            >
              <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                {actor.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {actor.content.replace(/\n/g, ' ').slice(0, 80)}...
              </p>
              <Badge variant="secondary">{actor.title === 'RansomHouse' ? 'Healthcare' : 'Manufacturing'}</Badge>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* Latest Research Papers */}
      <HomeSection title="Latest Security Research Papers">
        {loadingPapers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers?.slice(0, 8).map((paper, i) => (
              <RP_Card key={i} {...paper} />
            ))}
          </div>
        )}
      </HomeSection>

      {/* Recent Ransomware Activity */}
      <HomeSection title="Recent Local Ransomware Activity">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <Filter className="mr-2" />
                {sectorFilter || 'Filter Sector'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSectorFilter(null)}>
                All Sectors
              </DropdownMenuItem>
              {uniqueSectors.map((sec) => (
                <DropdownMenuItem key={sec} onSelect={() => setSectorFilter(sec)}>
                  {sec}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loadingVictims ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVictims.map((v) => (
              <div
                key={`${v.victim}-${v.attackdate}`}
                className="border border-border p-4 rounded-lg bg-background/40"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-mono font-medium text-lg break-words">{v.victim}</h3>
                  <Badge variant="outline">{v.group}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sector: <strong>{v.activity || 'Unknown'}</strong> • {v.attackdate}
                </p>
                {v.claim_url && (
                  <a
                    href={v.claim_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-500 underline pt-1 block"
                  >
                    View breach record
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </HomeSection>

      {/* Top Targeted Sectors */}
      <HomeSection title="Top Targeted Sectors Globally">
        {sectorStats.length > 0 && (
          <div className="flex justify-center p-6 rounded-lg border bg-muted/10">
            <div className="w-full max-w-md">
              <Doughnut data={doughnutData} options={{ responsive: true }} />
            </div>
          </div>
        )}
      </HomeSection>

      {/* Modal */}
      {modalContent && (
        <Modal
          title={modalContent.title}
          content={<ReactMarkdown>{modalContent.content}</ReactMarkdown>}
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
        />
      )}
    </div>
  );
}
