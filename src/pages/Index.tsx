import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

// --- UI Components ---
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
import { ContentCard } from "@/components/ContentCard";
import VictimCard from "@/components/VictimCard";
import RP_Card from "@/components/RP_Card";

// --- Icons ---
import {
  ArrowRight,
  Rss,
  FlaskConical,
  Skull,
  BookOpen,
  Search,
  FileText,
  UserCheck,
  MessageSquare,
  Library,
} from "lucide-react";

// --- Utilities & Hooks ---
import { cn } from "@/lib/utils";
import { FooterBackground } from "@/components/FooterBackground";

// --- Interfaces for API Data ---
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
  published?: string;
}

interface RansomwareVictim {
  victim: string;
  group_name?: string;
  discovered: string;
  activity?: string;
  country?: string;
  url?: string;
}

// --- Interfaces for Static Data ---
interface MiniReport {
  title: string;
  description: string;
  date: string;
  link: string;
  badge: string;
  tags?: string[];
}

interface ThreatProfile {
  id: number;
  title: string;
  description: string;
  link: string;
}

// --- Static Data ---
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

const threatProfilesData: ThreatProfile[] = [
  {
    id: 1,
    title: "RansomHouse Targets Chicago Healthcare",
    description:
      "RansomHouse claimed a March 2025 breach of Loretto Hospital in Chicago, stealing 1.5TB of patient data.",
    link: "/research",
  },
  {
    id: 2,
    title: "LockBit’s Midwest Manufacturing Victims",
    description:
      "LockBit ransomware continues to target manufacturers in Illinois and nearby states.",
    link: "/research",
  },
];

// --- Helper Function for Date Formatting ---
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Invalid date";
  }
};

// --- Reusable Dashboard Section Component ---
interface DashboardSectionProps {
  title: string;
  icon: React.ElementType;
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
  viewMoreLink?: string;
  className?: string;
  gridCols?: string;
  itemCount?: number;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  icon: Icon,
  isLoading,
  error,
  children,
  viewMoreLink,
  className,
  gridCols = "grid-cols-1",
  itemCount = 3,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "flex flex-col h-full bg-card border border-border/50 rounded-[--radius]",
          "transition-all duration-300 hover:shadow-md hover:border-primary/30",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-mono font-semibold tracking-tight text-card-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex-grow space-y-3 pt-0 pb-3 px-4">
          {isLoading && (
            <div className={cn("grid gap-3", gridCols)}>
              {[...Array(itemCount)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full h-20 rounded-[--radius] bg-muted/50"
                />
              ))}
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive font-sans text-center py-4">
              Failed to load data. Please try again later.
            </p>
          )}
          {!isLoading && !error && (
            <div className={cn("grid gap-3", gridCols)}>{children}</div>
          )}
        </CardContent>
        {viewMoreLink && !isLoading && !error && React.Children.count(children) > 0 && (
          <CardFooter className="pt-0 pb-3 px-4 border-t border-border/50 mt-auto">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full text-primary font-sans hover:bg-primary/5 hover:text-primary justify-center group transition-colors"
            >
              <Link to={viewMoreLink}>
                View More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

// --- Index Page Component ---
const Index: React.FC = () => {
  // --- State Management ---
  const [news, setNews] = useState<NewsItem[]>([]);
  const [research, setResearch] = useState<ResearchPaper[]>([]);
  const [ransomware, setRansomware] = useState<RansomwareVictim[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [researchLoading, setResearchLoading] = useState(true);
  const [ransomwareLoading, setRansomwareLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [ransomwareError, setRansomwareError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchData = async <T,>(
      url: string,
      setData: React.Dispatch<React.SetStateAction<T[]>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>,
      setError: React.Dispatch<React.SetStateAction<string | null>>,
      limit: number,
      dataPath?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const items = dataPath ? data[dataPath] : data;
        setData(Array.isArray(items) ? items.slice(0, limit) : []);
      } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
        setError(
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching data."
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData("/api/fetch-news", setNews, setNewsLoading, setNewsError, 3, "results");
    fetchData("/api/arxiv?limit=3", setResearch, setResearchLoading, setResearchError, 3);
    fetchData(
      "/api/ransomware?type=recent_victims&country=us&limit=3",
      setRansomware,
      setRansomwareLoading,
      setRansomwareError,
      3
    );
  }, []);

  // --- Event Handlers ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchInput.trim();
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // --- Animation Variants ---
  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // --- Render Logic ---
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background blob animations */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob-animation" />
        <div
          className="blob-animation"
          style={{ top: "60%", left: "80%", animationDelay: "5s", opacity: 0.06 }}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* Hero Section */}
        <motion.section
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left max-w-6xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tighter !leading-tight text-foreground">
            Chicago Cyber Threat Intelligence Community
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-3xl mx-auto md:mx-0 leading-relaxed">
            Your central hub for cyber defense in Chicagoland. Access real-time
            intelligence, share valuable insights, and strengthen local resilience.
          </p>
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-md sm:max-w-lg items-center gap-3 pt-4 mx-auto md:mx-0"
          >
            <Input
              type="search"
              placeholder="Search news, threats, resources..."
              aria-label="Search for cybersecurity news, threats, and resources"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 text-base h-11 rounded-[--radius] bg-background border-input focus:ring-2 focus:ring-ring font-sans"
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-[--radius] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </motion.section>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Latest News Section */}
          <DashboardSection
            title="Latest News Feed"
            icon={Rss}
            isLoading={newsLoading}
            error={newsError}
            viewMoreLink="/news"
            className="lg:col-span-1"
            itemCount={3}
          >
            {news.length > 0 ? (
              news.map((item) => (
                <ContentCard
                  key={item.link}
                  title={item.title}
                  description={item.snippet || "No description available."}
                  link={item.link}
                  date={formatDate(item.isoDate)}
                  source={item.sourceTitle || "Unknown Source"}
                  badge={item.sourceTitle || "News"}
                  tags={item.tags}
                />
              ))
            ) : (
              !newsLoading && (
                <p className="text-sm text-muted-foreground font-sans text-center py-6">
                  No recent news available.
                </p>
              )
            )}
          </DashboardSection>

          {/* Recent Ransomware Victims Section */}
          <DashboardSection
            title="Recent Ransomware Victims (US)"
            icon={Skull}
            isLoading={ransomwareLoading}
            error={ransomwareError}
            viewMoreLink="/research"
            className="lg:col-span-1"
            itemCount={3}
          >
            {ransomware.length > 0 ? (
              ransomware.map((item, index) => (
                <VictimCard
                  key={`${item.victim}-${item.discovered}-${index}`}
                  victim={item.victim}
                  group={item.group_name || "Unknown Group"}
                  attackdate={item.discovered}
                  activity={item.activity || "N/A"}
                  country={item.country || "N/A"}
                  claim_url={item.url}
                />
              ))
            ) : (
              !ransomwareLoading && (
                <p className="text-sm text-muted-foreground font-sans text-center py-6">
                  No recent US victims tracked.
                </p>
              )
            )}
          </DashboardSection>

          {/* Research Highlights Section */}
          <DashboardSection
            title="Research Paper Highlights"
            icon={FlaskConical}
            isLoading={researchLoading}
            error={researchError}
            viewMoreLink="/research"
            className="lg:col-span-1"
            itemCount={3}
          >
            {research.length > 0 ? (
              research.map((item) => (
                <RP_Card
                  key={item.link}
                  title={item.title}
                  summary={item.summary || "No summary available."}
                  link={item.link}
                  tags={item.tags || []}
                />
              ))
            ) : (
              !researchLoading && (
                <p className="text-sm text-muted-foreground font-sans text-center py-6">
                  No recent research papers found.
                </p>
              )
            )}
          </DashboardSection>

          {/* Featured Mini-Reports Section */}
          <DashboardSection
            title="Featured Mini-Reports"
            icon={FileText}
            isLoading={false}
            error={null}
            viewMoreLink="/reports"
            className="lg:col-span-1 sm:col-span-1"
            itemCount={miniReportsData.length}
          >
            {miniReportsData.map((report, i) => (
              <ContentCard
                key={i}
                title={report.title}
                description={report.description}
                date={formatDate(report.date)}
                tags={report.tags || []}
                link={report.link}
                badge={report.badge}
              />
            ))}
          </DashboardSection>

          {/* Threat Actor Spotlights Section */}
          <DashboardSection
            title="Threat Actor Spotlights"
            icon={UserCheck}
            isLoading={false}
            error={null}
            viewMoreLink="/research"
            className="lg:col-span-1 sm:col-span-1"
            itemCount={threatProfilesData.length}
          >
            {threatProfilesData.map((profile) => (
              <ContentCard
                key={profile.id}
                title={profile.title}
                description={profile.description}
                link={profile.link}
                badge="Spotlight"
              />
            ))}
          </DashboardSection>

          {/* Quick Links Section */}
          <DashboardSection
            title="Explore CCTIC"
            icon={Library}
            isLoading={false}
            error={null}
            className="sm:col-span-2 lg:col-span-1"
            gridCols="grid-cols-1"
          >
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="justify-start text-base font-sans text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-[--radius] h-11"
              >
                <Link to="/discussions">
                  <MessageSquare className="mr-3 h-5 w-5 text-primary group-hover:text-accent-foreground" />
                  Discussions
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="justify-start text-base font-sans text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-[--radius] h-11"
              >
                <Link to="/resources">
                  <BookOpen className="mr-3 h-5 w-5 text-primary group-hover:text-accent-foreground" />
                  Resources
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="justify-start text-base font-sans text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-[--radius] h-11"
              >
                <Link to="/about">
                  <UserCheck className="mr-3 h-5 w-5 text-primary group-hover:text-accent-foreground" />
                  About CCTIC
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