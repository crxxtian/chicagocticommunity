// src/pages/Index.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

// UI components & icons
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ArrowRight,
  Rss,
  Skull,
  FlaskConical,
  FileText,
  Library,
  UserCheck,
  Search as LucideSearch,
  Filter,
  Calendar,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

import { ContentCard } from "@/components/ContentCard";
import VictimCard from "@/components/VictimCard";
import RP_Card from "@/components/RP_Card";
import { cn } from "@/lib/utils";
import { featuredRef, FeaturedRef } from "@/config/featured";

// —————————————————————————————————
// Type guards
// —————————————————————————————————
function hasLink(x: any): x is { link: string } {
  return x && typeof x.link === "string";
}
function hasUrl(x: any): x is { url: string } {
  return x && typeof x.url === "string";
}

// —————————————————————————————————
// DashboardSection (wraps each panel with reveal-on-scroll)
// —————————————————————————————————
interface DashboardSectionProps {
  title: string;
  icon: React.ElementType;
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  viewMoreLink?: string;
  cols?: string;
}
const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  icon: Icon,
  isLoading,
  error,
  children,
  viewMoreLink,
  cols = "grid-cols-1",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="flex flex-col bg-card border border-border/20 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-primary to-primary-dark/70">
          <CardTitle className="text-base font-semibold text-white">{title}</CardTitle>
          <Icon className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className={cn("grid gap-4 px-6 py-4", cols)}>
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg bg-muted/50" />
          ))}
          {error && (
            <p className="text-destructive text-center w-full">{error}</p>
          )}
          {!isLoading && !error && children}
        </CardContent>
        {viewMoreLink && !isLoading && !error && (
          <CardFooter className="px-6 py-3 border-t border-border/20">
            <Button asChild variant="ghost" size="sm" className="w-full justify-center">
              <Link to={viewMoreLink}>
                View More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

// —————————————————————————————————
// Data interfaces
// —————————————————————————————————
interface NewsItem {
  title: string;
  snippet?: string;
  date: string;
  link: string;
  badge: string;
  tags?: string[];
  source?: string;
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
  sector?: string;
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

// —————————————————————————————————
// Featured lookup helper
// —————————————————————————————————
function resolveFeatured<T>(
  ref: FeaturedRef,
  pools: Record<FeaturedRef["type"], any[]>
): any | undefined {
  const pool = pools[ref.type] || [];
  if (ref.type === "ransomware") {
    return pool.find((x: any) => x.url === ref.id);
  }
  return pool.find((x: any) => x.link === ref.id);
}

// —————————————————————————————————
// Fetch helper with limit
// —————————————————————————————————
async function fetchJSON<T>(
  url: string,
  setData: React.Dispatch<React.SetStateAction<T[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  limit: number = Infinity
) {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    const arr: T[] = Array.isArray(json)
      ? json
      : Array.isArray(json.results)
      ? json.results
      : [];
    setData(arr.slice(0, limit));
  } catch (e: any) {
    setError(e.message || "Failed to load");
  } finally {
    setLoading(false);
  }
}

// —————————————————————————————————
// Main Index component
// —————————————————————————————————
const Index: React.FC = () => {
  const navigate = useNavigate();

  // state for feeds
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState<string | null>(null);

  const [victims, setVictims] = useState<RansomwareVictim[]>([]);
  const [victimsLoading, setVictimsLoading] = useState(true);
  const [victimsError, setVictimsError] = useState<string | null>(null);

  // filters for news
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc"|"desc">("desc");

  // mini reports (static)
  const miniReportsData: MiniReport[] = [
    {
      title: "Chicago Public Schools Data Breach Exposes Student Information",
      description: "In March 2025, CPS reported a breach …",
      date: "2025-03-07T00:00:00Z",
      link: "/reports/1",
      badge: "Education",
      tags: ["education","data breach"],
    },
    {
      title: "SRAM Investigates Cybersecurity Incident…",
      description: "Chicago-based SRAM faced an IT outage…",
      date: "2025-03-27T00:00:00Z",
      link: "/reports/2",
      badge: "Manufacturing",
      tags: ["manufacturing","cybersecurity"],
    },
  ];

  // fetch data on mount
  useEffect(() => {
    fetchJSON<NewsItem>(
      "/api/fetch-news?limit=50",
      setAllNews, setNewsLoading, setNewsError
    );
    fetchJSON<ResearchPaper>(
      "/api/arxiv?limit=2",
      setPapers, setPapersLoading, setPapersError, 2
    );
    fetchJSON<RansomwareVictim>(
      "/api/ransomware?type=recent_victims&limit=3",
      setVictims, setVictimsLoading, setVictimsError, 3
    );
  }, []);

  // derive categories
  const categories = Array.from(
    new Set(allNews.flatMap(n => [n.badge, ...(n.tags||[])]))
  ).filter(Boolean) as string[];

  // filter, sort & slice top 3 news
  const filteredNews = allNews
    .filter(n => 
      (!featuredRef || featuredRef.type !== "news" || n.link !== featuredRef.id) &&
      (!searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedCategory || n.badge === selectedCategory || n.tags?.includes(selectedCategory))
    );
  const sortedNews = filteredNews
    .sort((a,b) => {
      const da = new Date(a.date).getTime(), db = new Date(b.date).getTime();
      return sortOrder==="desc"? db-da : da-db;
    })
    .slice(0,3);

  // get featured item
  const featuredItem = resolveFeatured(featuredRef, {
    news: allNews,
    research: papers,
    ransomware: victims,
    miniReport: miniReportsData,
  });

  const fmt = (iso: string) => {
    try { return format(parseISO(iso), "MMM d, yyyy"); }
    catch { return "Unknown date"; }
  };

  // site-wide search
  const [siteSearch, setSiteSearch] = useState("");
  const handleSiteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteSearch.trim()) {
      navigate(`/search?query=${encodeURIComponent(siteSearch.trim())}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white overflow-hidden">
      {/* animated blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob-animation"></div>
        <div
          className="blob-animation"
          style={{ top: "65%", left: "70%", opacity: 0.05, animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-20">

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Chicago Cyber Threat Intelligence Community
          </h1>
          <p className="text-lg text-gray-300">
            Real-time feeds, reports, and community resources for Chicagoland’s cyber defenders.
          </p>
          <form onSubmit={handleSiteSearch} className="flex mx-auto max-w-md gap-4">
            <Input
              value={siteSearch}
              onChange={e => setSiteSearch(e.target.value)}
              placeholder="Search entire site…"
              className="flex-1 bg-gray-800 placeholder-gray-500"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-colors"
            >
              <LucideSearch className="mr-2 h-5 w-5" /> Search
            </Button>
          </form>
        </motion.section>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {[
            { label: "News", icon: Rss, to: "/news" },
            { label: "Mini-Reports", icon: FileText, to: "/reports" },
            { label: "Discussions", icon: UserCheck, to: "/discussions" },
            { label: "Resources", icon: Library, to: "/resources" },
          ].map(({ label, icon: Icon, to }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <Card className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl text-center">
                <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-medium">{label}</p>
                <Link to={to} className="absolute inset-0" aria-label={label} />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Story */}
        {featuredItem && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gray-800 rounded-2xl hover:shadow-2xl transition-shadow">
              <h2 className="text-3xl font-semibold mb-4">Featured Story</h2>
              {"snippet" in featuredItem ? (
                <p className="text-gray-300 mb-4">{featuredItem.snippet}</p>
              ) : "summary" in featuredItem ? (
                <p className="text-gray-300 mb-4">{featuredItem.summary}</p>
              ) : null}
              <div className="flex justify-between text-sm text-gray-400 mb-6">
                <span>{fmt(featuredItem.date)}</span>
                {"badge" in featuredItem && (
                  <span className="uppercase tracking-wider text-primary">
                    {featuredItem.badge}
                  </span>
                )}
              </div>
              {hasLink(featuredItem) && (
                <Link
                  to={featuredItem.link}
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Read more <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
              {hasUrl(featuredItem) && (
                <a
                  href={featuredItem.url}
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Read more <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              )}
            </Card>
          </motion.section>
        )}

        {/* News & Victims */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardSection
            title="Latest News"
            icon={Rss}
            isLoading={newsLoading}
            error={newsError}
            viewMoreLink="/news"
            cols="grid-cols-1"
          >
            {/* filters */}
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <div className="relative flex-1">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter news…"
                  className="pl-10 bg-gray-800 placeholder-gray-500"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4 text-primary" />
                    {selectedCategory || "Category"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput placeholder="Search tags…" />
                    <CommandList>
                      <CommandEmpty>No matches</CommandEmpty>
                      <CommandGroup heading="Categories">
                        <CommandItem onSelect={() => setSelectedCategory("")}>
                          All
                        </CommandItem>
                        {categories.map(cat => (
                          <CommandItem key={cat} onSelect={() => setSelectedCategory(cat)}>
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setSortOrder(o => (o === "desc" ? "asc" : "desc"))}
              >
                <Calendar className="h-4 w-4 text-primary" /> Date
                <ArrowUpDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    sortOrder === "asc" && "rotate-180"
                  )}
                />
              </Button>
            </div>

            {!newsLoading &&
              !newsError &&
              sortedNews.map(n => (
                <ContentCard
                  key={n.link}
                  title={n.title}
                  description={n.snippet || "No description available."}
                  link={n.link}
                  date={fmt(n.date)}
                  badge={n.badge}
                  tags={n.tags}
                  source={n.source}
                  className="hover:shadow-lg transition-shadow duration-200"
                />
              ))}
          </DashboardSection>

          <DashboardSection
            title="Ransomware Victims (US)"
            icon={Skull}
            isLoading={victimsLoading}
            error={victimsError}
            cols="grid-cols-1"
          >
            {!victimsLoading &&
              !victimsError &&
              victims.map((v, i) => (
                <VictimCard
                  key={i}
                  victim={v.victim}
                  group={v.group_name || "Unknown"}
                  attackdate={v.discovered}
                  activity={v.sector || "—"}
                  country={v.country || "—"}
                  claim_url={v.url}
                />
              ))}
          </DashboardSection>
        </section>

        {/* Research & Mini-Reports */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardSection
            title="Recently Published Security Papers"
            icon={FlaskConical}
            isLoading={papersLoading}
            error={papersError}
            viewMoreLink="/research"
            cols="grid-cols-1"
          >
            {!papersLoading &&
              !papersError &&
              papers.map(p => (
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
            title="CCTIC Mini Reports"
            icon={FileText}
            isLoading={false}
            error={null}
            viewMoreLink="/reports"
            cols="grid-cols-1"
          >
            {miniReportsData.map((r, i) => (
              <ContentCard
                key={i}
                title={r.title}
                description={r.description}
                link={r.link}
                date={fmt(r.date)}
                badge={r.badge}
                tags={r.tags}
                className="hover:shadow-lg transition-shadow duration-200"
              />
            ))}
          </DashboardSection>
        </section>

      </div>
    </div>
  );
};

export default Index;
