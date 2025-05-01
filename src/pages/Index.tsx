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

export default function Index() {
  const nav = useNavigate();
  const [news, setNews] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [victims, setVictims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    Promise.all([
      fetch("/api/fetch-news").then((r) => r.json()),
      fetch("/api/arxiv").then((r) => r.json()),
      fetch("/api/ransomware?type=recentvictims").then((r) => r.json()),
    ])
      .then(([n, p, v]) => {
        setNews(n.results ?? n);
        setPapers(p);
        setVictims(v);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  const fmt = (iso: string) =>
    isNaN(Date.parse(iso))
      ? "Unknown"
      : format(parseISO(iso), "MMM d, yyyy, h:mm a");

  const filteredNews = useMemo(() => {
    return news
      .filter((i) =>
        (!search ||
          i.title.toLowerCase().includes(search.toLowerCase())) &&
        (!category ||
          i.badge === category ||
          i.tags?.includes(category))
      )
      .sort((a, b) => {
        const da = new Date(a.date).valueOf();
        const db = new Date(b.date).valueOf();
        return order === "desc" ? db - da : da - db;
      })
      .slice(0, 4);
  }, [news, search, category, order]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          news.flatMap((i) => [i.badge, ...(i.tags ?? [])]).filter(Boolean)
        )
      ),
    [news]
  );

  const usVictims = useMemo(
    () => victims.filter((v) => v.country === "US"),
    [victims]
  );

  const miniReports = [
    {
      title: "Chicago Public Schools Data Breach",
      description: "CPS confirmed student data exposure in March 2025.",
      date: "2025-03-07T00:00:00Z",
      link: "/mini-reports/1",
      badge: "Education",
      tags: ["education", "data breach"],
    },
    {
      title: "SRAM Investigates Cybersecurity Incident",
      description: "Chicago-based SRAM faced an IT outage…",
      date: "2025-03-27T00:00:00Z",
      link: "/mini-reports/2",
      badge: "Manufacturing",
      tags: ["manufacturing", "cybersecurity"],
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-subtle text-foreground min-h-screen">
      {/* three animated blobs */}
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
            Real-time feeds, reports, and community tools for Chicagoland
            defenders.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) nav(`/search?query=${search.trim()}`);
            }}
            className="mx-auto flex max-w-lg gap-2"
          >
            <Input
              placeholder="Search entire site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <LucideSearch className="h-5 w-5" />
            </Button>
          </form>
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
            >
              <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
              <span className="font-medium">{label}</span>
              <div
                className="absolute inset-0"
                onClick={() => nav(to)}
                role="button"
                aria-label={label}
              />
            </Card>
          ))}
        </div>

        {/* Latest News */}
        <HomeSection title="Latest News" linkTo="/news">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter news..."
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
                      <CommandItem
                        key={c}
                        onSelect={() => setCategory(c)}
                      >
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

        {/* Ransomware Victims */}
        <HomeSection title="Recent Ransomware Victims (US)" linkTo="/research">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {usVictims.slice(0, 6).map((v, i) => (
              <VictimCard key={i} {...v} />
            ))}
          </div>
        </HomeSection>

        {/* Security Papers */}
        <HomeSection
          title="Recently Published Security Papers"
          linkTo="/research"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {papers.map((p) => (
              <RP_Card key={p.link} {...p} />
            ))}
          </div>
        </HomeSection>

        {/* Mini Reports */}
        <HomeSection title="CCTIC Mini Reports" linkTo="/mini-reports">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {miniReports.map((r, i) => (
              <ContentCard
                key={i}
                title={r.title}
                description={r.description}
                link={r.link}
                date={fmt(r.date)}
                badge={r.badge}
                tags={r.tags}
              />
            ))}
          </div>
        </HomeSection>
      </div>
    </div>
  );
}
