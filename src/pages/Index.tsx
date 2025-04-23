// src/pages/Index.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

// -- shadcn/ui components --
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

// -- custom cards/hooks/utilities --
import { ContentCard } from "@/components/ContentCard";
import VictimCard from "@/components/VictimCard";
import RP_Card from "@/components/RP_Card";
import { cn } from "@/lib/utils";

// -- icons --
import {
  ArrowRight,
  Rss,
  FlaskConical,
  Skull,
  FileText,
  UserCheck,
  Search,
  Library,
} from "lucide-react";

// -- Data interfaces --
interface NewsItem {
  title: string;
  link: string;
  snippet?: string;
  isoDate?: string;
  sourceTitle?: string;
  tags?: string[];
}
interface ResearchPaper {
  title: string;
  summary: string;
  link: string;
  tags?: string[];
}
interface RansomwareVictim {
  victim: string;
  group_name?: string;
  discovered: string;
  activity?: string;
  country?: string;
  url?: string;
}
interface MiniReport {
  title: string;
  description: string;
  date: string;
  link: string;
  badge: string;
  tags?: string[];
}

// -- Static mini-reports for demo/fallback --
const miniReportsData: MiniReport[] = [
  {
    title: "Chicago Public Schools Data Breach Exposes Student Information",
    description:
      "In March 2025, CPS reported a breach involving a vendor's server that exposed data of over 700,000 current and former students.",
    date: "2025-03-07",
    link: "/reports/1",
    badge: "Education",
    tags: ["education", "data breach", "student information"],
  },
  {
    title: "SRAM Investigates Cybersecurity Incident Affecting IT Systems",
    description:
      "Chicago-based SRAM faced an IT outage in March 2025 due to a cybersecurity incident. Systems were restored and monitored closely.",
    date: "2025-03-27",
    link: "/reports/2",
    badge: "Manufacturing",
    tags: ["manufacturing", "cybersecurity", "IT outage"],
  },
];

// -- Helper for formatting dates --
const formatDate = (iso?: string) => {
  if (!iso) return "Unknown date";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
};

// -- The reusable section component --
interface SectionProps {
  title: string;
  icon: React.ElementType;
  isLoading: boolean;
  error: string | null;
  viewMoreLink?: string;
  children: React.ReactNode;
  cols?: string; // e.g. "grid-cols-1 md:grid-cols-2"
}
const DashboardSection: React.FC<SectionProps> = ({
  title,
  icon: Icon,
  isLoading,
  error,
  viewMoreLink,
  children,
  cols = "grid-cols-1",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="flex flex-col bg-card border border-border/50 rounded-[--radius] hover:shadow-md transition-shadow">
        <CardHeader className="flex items-center justify-between px-4 pt-4 pb-2">
          <CardTitle className="text-sm font-mono font-semibold text-card-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className={cn("px-4 pb-4 pt-2 grid gap-4", cols)}>
          {isLoading && (
            Array.from({ length:  cols.includes("grid-cols-2") ? 2 : 1 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[--radius]" />
            ))
          )}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          {!isLoading && !error && children}
        </CardContent>
        {viewMoreLink && !isLoading && !error && (
          <CardFooter className="px-4 pb-4 pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-center text-primary hover:bg-primary/10 transition-colors"
            >
              <Link to={viewMoreLink}>
                View More <ArrowRight className="inline ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

// -- Main Index Page --
const Index: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [ransom, setRansom] = useState<RansomwareVictim[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingRansom, setLoadingRansom] = useState(true);
  const [errorNews, setErrorNews] = useState<string | null>(null);
  const [errorPapers, setErrorPapers] = useState<string | null>(null);
  const [errorRansom, setErrorRansom] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  // fetch wrapper
  async function fetchData<T>(
    url: string,
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    loadingSetter: React.Dispatch<React.SetStateAction<boolean>>,
    errorSetter: React.Dispatch<React.SetStateAction<string | null>>,
    key?: string
  ) {
    loadingSetter(true);
    errorSetter(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      const arr: T[] = key ? json[key] : json;
      setter(Array.isArray(arr) ? arr : []);
    } catch (e: any) {
      errorSetter(e.message || "Unable to fetch data");
    } finally {
      loadingSetter(false);
    }
  }

  // on mount
  useEffect(() => {
    fetchData<NewsItem>("/api/fetch-news", setNews, setLoadingNews, setErrorNews, "results");
    fetchData<ResearchPaper>("/api/arxiv?limit=3", setPapers, setLoadingPapers, setErrorPapers);
    fetchData<RansomwareVictim>(
      "/api/ransomware?type=recent_victims&limit=3",
      setRansom,
      setLoadingRansom,
      setErrorRansom
    );
  }, []);

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) nav(`/search?query=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="relative bg-background min-h-screen text-foreground overflow-hidden">

      {/* subtle background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="blob-animation" />
        <div
          className="blob-animation"
          style={{ top: "60%", left: "80%", opacity: 0.06, animationDelay: "5s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Hero + Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <h1 className="text-5xl font-mono font-bold tracking-tight">
            Chicago Cyber Threat Intelligence Community
          </h1>
          <p className="text-lg text-muted-foreground">
            Your central hub for cyber defense in Chicagoland. Access real-time
            intelligence, share valuable insights, and strengthen local resilience.
          </p>
          <form onSubmit={doSearch} className="flex max-w-md mx-auto gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news, threats, resources…"
              className="flex-1"
            />
            <Button type="submit" className="bg-primary text-primary-foreground">
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </form>
        </motion.div>

        {/* Featured News (full width) */}
        <section>
          <Card className="bg-card border-border rounded-[--radius] p-6 hover:shadow-lg transition-shadow">
            {loadingNews ? (
              <Skeleton className="h-32 w-full rounded-[--radius]" />
            ) : errorNews ? (
              <p className="text-center text-destructive">{errorNews}</p>
            ) : news[0] ? (
              <div>
                <h2 className="text-2xl font-semibold mb-2">{news[0].title}</h2>
                <p className="text-muted-foreground mb-4">
                  {news[0].snippet || "No description available."}
                </p>
                <Link
                  to={news[0].link}
                  className="inline-flex items-center text-primary hover:underline"
                  target="_blank"
                >
                  Read full story <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No featured news available.
              </p>
            )}
          </Card>
        </section>

        {/* Two-column: News ↔ Ransomware */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardSection
            title="Latest News"
            icon={Rss}
            isLoading={loadingNews}
            error={errorNews}
            viewMoreLink="/news"
            cols="grid-cols-1"
          >
            {news.slice(0, 3).map((n) => (
              <ContentCard
                key={n.link}
                title={n.title}
                description={n.snippet}
                link={n.link}
                date={formatDate(n.isoDate)}
                source={n.sourceTitle}
                tags={n.tags}
              />
            ))}
          </DashboardSection>

          <DashboardSection
            title="Ransomware Victims"
            icon={Skull}
            isLoading={loadingRansom}
            error={errorRansom}
            viewMoreLink="/research"
            cols="grid-cols-1"
          >
            {ransom.map((r, i) => (
              <VictimCard
                key={i}
                victim={r.victim}
                group={r.group_name}
                attackdate={r.discovered}
                activity={r.activity}
                country={r.country}
                claim_url={r.url}
              />
            ))}
          </DashboardSection>
        </section>

        {/* Two-column: Research ↔ Mini-Reports */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardSection
            title="Research Highlights"
            icon={FlaskConical}
            isLoading={loadingPapers}
            error={errorPapers}
            viewMoreLink="/research"
            cols="grid-cols-1"
          >
            {papers.map((p) => (
              <RP_Card
                key={p.link}
                title={p.title}
                summary={p.summary}
                link={p.link}
                tags={p.tags}
              />
            ))}
          </DashboardSection>

          <DashboardSection
            title="Mini Reports"
            icon={FileText}
            isLoading={false}
            error={null}
            viewMoreLink="/reports"
            cols="grid-cols-1"
          >
            {miniReportsData.map((rep, i) => (
              <ContentCard
                key={i}
                title={rep.title}
                description={rep.description}
                link={rep.link}
                date={formatDate(rep.date)}
                badge={rep.badge}
                tags={rep.tags}
              />
            ))}
          </DashboardSection>
        </section>

        {/* Links (full width) */}
        <section>
          <DashboardSection
            title="Explore CCTIC"
            icon={Library}
            isLoading={false}
            error={null}
            cols="grid-cols-1"
          >
            <div className="space-y-3">
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link to="/discussions">
                  <UserCheck className="mr-2 h-5 w-5" /> Discussions
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link to="/resources">
                  <Library className="mr-2 h-5 w-5" /> Resources
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/about">
                  <UserCheck className="mr-2 h-5 w-5" /> About CCTIC
                </Link>
              </Button>
            </div>
          </DashboardSection>
        </section>
      </div>
    </div>
  );
};

export default Index;
