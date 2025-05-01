// src/pages/Index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rss, FileText, Library, Search as LucideSearch,
  ArrowUpDown, Calendar, Filter, Skull, FlaskConical
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList
} from "@/components/ui/command";

import { ContentCard } from "@/components/ContentCard";
import VictimCard from "@/components/VictimCard";
import RP_Card from "@/components/RP_Card";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const Index: React.FC = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [victims, setVictims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    Promise.all([
      fetch("/api/fetch-news").then((r) => r.json()),
      fetch("/api/arxiv").then((r) => r.json()),
      fetch("/api/ransomware?type=recentvictims").then((r) => r.json()),
    ])
      .then(([newsRes, papersRes, victimsRes]) => {
        setNews(newsRes.results || newsRes);
        setPapers(papersRes);
        setVictims(victimsRes);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to fetch data");
        console.error(e);
      });
  }, []);

  const fmt = (iso: string) => {
    try {
      return format(parseISO(iso), "PPpp");
    } catch {
      return "Unknown";
    }
  };

  const filteredNews = useMemo(() => {
    return news
      .filter((n) =>
        (!search || n.title.toLowerCase().includes(search.toLowerCase())) &&
        (!category || n.badge === category || n.tags?.includes(category))
      )
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sort === "desc" ? db - da : da - db;
      })
      .slice(0, 4);
  }, [news, search, category, sort]);

  const categories = useMemo(
    () =>
      Array.from(new Set(news.flatMap((n) => [n.badge, ...(n.tags || [])]))).filter(Boolean),
    [news]
  );

  const usVictims = useMemo(() => victims.filter((v) => v.country === "US"), [victims]);

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
    <div className="min-h-screen bg-gradient-subtle text-foreground relative overflow-hidden">
      <div className="blob-animation" />
      <div className="blob-2" />
      <div className="blob-3" />
      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold font-mono">Chicago Cyber Threat Intelligence</h1>
          <p className="text-muted-foreground text-lg">
            Real-time feeds, reports, and tools for Chicagoland defenders.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search) navigate(`/search?query=${encodeURIComponent(search)}`);
            }}
            className="max-w-md mx-auto flex gap-2"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entire site..."
              className="flex-1"
            />
            <Button type="submit">
              <LucideSearch className="mr-1 h-5 w-5" /> Search
            </Button>
          </form>
        </motion.section>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "News", icon: Rss, to: "/news" },
            { label: "Mini Reports", icon: FileText, to: "/mini-reports" },
            { label: "Research", icon: FlaskConical, to: "/research" },
            { label: "Resources", icon: Library, to: "/resources" },
          ].map(({ label, icon: Icon, to }) => (
            <Card
              key={label}
              className="relative p-4 text-center bg-card border border-border shadow hover:shadow-md"
            >
              <Icon className="mx-auto mb-2 text-primary" />
              <p className="font-medium">{label}</p>
              <Link to={to} className="absolute inset-0" aria-label={label} />
            </Card>
          ))}
        </div>

        {/* News */}
        <section>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter news..."
              className="w-full sm:w-auto"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> {category || "Category"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandList>
                    <CommandEmpty>No tags</CommandEmpty>
                    <CommandGroup heading="Categories">
                      <CommandItem onSelect={() => setCategory("")}>All</CommandItem>
                      {categories.map((cat) => (
                        <CommandItem key={cat} onSelect={() => setCategory(cat)}>
                          {cat}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button variant="outline" onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}>
              <Calendar className="mr-2 h-4 w-4" /> Date <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
          {loading && <Skeleton className="w-full h-24 rounded-md" />}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            filteredNews.map((n) => (
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
        </section>

        {/* Ransomware Victims */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Skull /> Recent Ransomware Victims (US)
          </h2>
          {usVictims.slice(0, 3).map((v, i) => (
            <VictimCard key={i} {...v} />
          ))}
        </section>

        {/* Research Papers */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FlaskConical /> Recently Published Security Papers
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {papers.map((p) => (
              <RP_Card key={p.link} {...p} />
            ))}
          </div>
        </section>

        {/* Mini Reports */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText /> CCTIC Mini Reports
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
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
        </section>
      </div>
    </div>
  );
};

export default Index;
