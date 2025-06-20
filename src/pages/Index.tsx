// src/pages/Index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rss,
  FileText,
  Library,
  Search as LucideSearch,
  ArrowUpDown,
  Calendar,
  Filter,
  Skull,
  FlaskConical,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ContentCard } from "@/components/ContentCard";
import VictimCard from "@/components/VictimCard";
import RP_Card from "@/components/RP_Card";
import { HomeSection } from "@/components/HomeSection";

interface NewsItem {
  title: string;
  description: string;
  date: string;
  badge: string;
  tags?: string[];
  link: string;
}

interface Paper {
  title: string;
  summary: string;
  link: string;
}

interface Victim {
  victim: string;
  group: string;
  attackdate: string;
  activity: string;
  country: string;
  claim_url?: string;
}

export default function Index() {
  const nav = useNavigate();

  // search vs news-filter vs category vs date-order
  const [siteSearch, setSiteSearch] = useState("");
  const [newsFilter, setNewsFilter] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [news, setNews] = useState<NewsItem[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch all three endpoints in parallel
  useEffect(() => {
    Promise.all([
      fetch("/api/fetch-news").then((r) => r.json()),
      fetch("/api/arxiv").then((r) => r.json()),
      fetch("/api/ransomware?type=recentvictims").then((r) => r.json()),
    ])
      .then(([nRes, pRes, vRes]) => {
        setNews(nRes.results ?? nRes);
        setPapers(pRes);
        setVictims(vRes);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  // format ISO → "Apr 1, 2025, 6:00 PM"
  const fmt = (iso: string) =>
    isNaN(Date.parse(iso))
      ? "Unknown"
      : format(parseISO(iso), "MMM d, yyyy, h:mm a");

  // apply filter, category, sort, limit to 4
  const filteredNews = useMemo(() => {
    return news
      .filter((i) =>
        !newsFilter
          ? true
          : i.title.toLowerCase().includes(newsFilter.toLowerCase())
      )
      .filter((i) =>
        !category
          ? true
          : i.badge === category || i.tags?.includes(category)
      )
      .sort((a, b) => {
        const da = new Date(a.date).valueOf();
        const db = new Date(b.date).valueOf();
        return order === "desc" ? db - da : da - db;
      })
      .slice(0, 4);
  }, [news, newsFilter, category, order]);

  // all unique badges+tags
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          news
            .flatMap((i) => [i.badge, ...(i.tags ?? [])])
            .filter(Boolean)
        )
      ),
    [news]
  );

  // victims in the US
  const usVictims = useMemo(
    () => victims.filter((v) => v.country === "US"),
    [victims]
  );

  // mini-reports array
  const miniReports = [
    {
      id: 1,
      title: "Chicago Public Schools Data Breach Exposes Student Information",
      description:
        "In March 2025, CPS reported a breach exposing names, DOBs, genders, and IDs of ~700,000 students.",
      date: "2025-03-07T00:00:00Z",
      link: "/mini-reports/1",
      badge: "Education",
      tags: ["education", "data breach", "student information"],
    },
    {
      id: 2,
      title: "SRAM Investigates Cybersecurity Incident Affecting IT Systems",
      description:
        "In April 2025, SRAM faced an IT outage due to a cyber issue; systems restored, investigation ongoing.",
      date: "2025-04-01T00:00:00Z",
      link: "/mini-reports/2",
      badge: "Manufacturing",
      tags: ["manufacturing", "cybersecurity", "IT outage"],
    },
    {
      id: 3,
      title: "RansomHouse Claims Attack on Loretto Hospital in Chicago",
      description:
        "RansomHouse alleges they stole 1.5 TB of data from Loretto Hospital; details remain under review.",
      date: "2025-03-10T00:00:00Z",
      link: "/mini-reports/3",
      badge: "Healthcare",
      tags: ["healthcare", "ransomware", "data breach"],
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-subtle text-foreground min-h-screen">
      {/* animated blobs */}
      <div className="blob-animation" />
      <div className="blob-2" />
      <div className="blob-3" />

      <div className="container mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-5xl font-mono font-bold">
            Chicago Cyber Threat Intelligence
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time feeds, reports, and community tools for Chicagoland defenders.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = siteSearch.trim();
              if (q) nav(`/search?query=${encodeURIComponent(q)}`);
            }}
            className="mx-auto flex max-w-lg gap-2"
          >
            <Input
              placeholder="Search entire site..."
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <LucideSearch className="h-5 w-5" />
            </Button>
          </form>
          <Button variant="primary" onClick={() => window.location.href = '/newsletter'}>
            Join our Free Newsletter!
          </Button>
        </motion.section>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "News", icon: Rss, to: "/news" },
            { label: "Mini Reports", icon: FileText, to: "/mini-reports" },
            { label: "Research", icon: FlaskConical, to: "/research" },
            { label: "Resources", icon: Library, to: "/resources" },
          ].map(({ label, icon: Icon, to }) => (
            <Card
              key={label}
              className="group relative flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow"
              onClick={() => nav(to)}
              role="button"
              aria-label={label}
            >
              <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
              <span className="font-medium">{label}</span>
            </Card>
          ))}
        </div>

        {/* Latest News */}
        <HomeSection title="Latest News" linkTo="/news">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Filter news..."
              value={newsFilter}
              onChange={(e) => setNewsFilter(e.target.value)}
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
                  <Filter className="mr-1 h-4 w-4" />
                  {category || "Category"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search tags…" />
                  <CommandEmpty>No tags</CommandEmpty>
                  <CommandGroup heading="Categories">
                    <CommandItem onSelect={() => setCategory("")}>
                      All
                    </CommandItem>
                    {categories.map((c) => (
                      <CommandItem key={c} onSelect={() => setCategory(c)}>
                        {c}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="whitespace-nowrap"
            >
              <Calendar className="mr-1 h-4 w-4" />
              Date <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredNews.map((n) => (
                <ContentCard
                  key={n.link}
                  title={n.title}
                  description={n.description}
                  link={n.link}
                  date={fmt(n.date)}
                  badge={n.badge}
                  tags={n.tags}
                />
              ))}
            </div>
          )}
        </HomeSection>

        {/* Recent Ransomware Victims */}
        <HomeSection title="Recent Ransomware Victims (US)" linkTo="/research">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {usVictims.slice(0, 6).map((v, i) => (
              <VictimCard key={i} {...v} />
            ))}
          </div>
        </HomeSection>
      </div>
    </div>
  );
}
