import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContentCard } from "@/components/ContentCard";
import { HomeSection } from "@/components/HomeSection";
import { CyberFooterPulse } from "@/components/CyberFooterPulse";

type NewsItem = {
  title: string;
  description: string;
  date: string;
  link: string;
  category: string;
  image?: string | null;
  source?: string;
};

const miniReports = [
  {
    id: 1,
    title: "Chicago Public Schools Data Breach Exposes Student Information",
    description:
      "In March 2025, CPS reported a breach involving a vendor's server that exposed data of over 700,000 current and former students.",
    date: "2025-03-07",
    tags: ["education", "data breach", "student information"],
    link: "/mini-reports/1",
  },
  {
    id: 2,
    title: "SRAM Investigates Cybersecurity Incident Affecting IT Systems",
    description:
      "Chicago-based SRAM faced an IT outage in March 2025 due to a cybersecurity incident. Systems were restored and monitored closely.",
    date: "2025-03-27",
    tags: ["manufacturing", "cybersecurity", "IT outage"],
    link: "/mini-reports/2",
  },
];

const threatProfiles = [
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

const Index = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // 👇 Adds a timestamp to bust Vercel/browser cache
    fetch(`/api/fetch-news?cb=${Date.now()}`)
      .then((res) => res.json())
      .then((data: NewsItem[]) => {
        setLatestNews(data.slice(0, 3)); // just show top 3
      })
      .catch((err) => console.error("Failed to load latest news", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Intro */}
      <div className="mb-12 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-mono font-bold mb-4"
        >
          Chicago Cyber Threat Intelligence Community
        </motion.h1>
        <p className="text-lg font-medium text-muted-foreground">
          <strong>
            CCTIC is a hub for local collaboration, intel sharing, and defense strategy in the Chicagoland area.
          </strong>
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="mb-10 p-6 border border-border rounded-md bg-secondary/30">
        <p className="font-medium text-muted-foreground">
          <strong>Welcome.</strong> Our mission is to improve Chicagoland’s cyber resilience through real-time threat sharing, expert analysis, and a local-first approach to community defense.
        </p>
      </div>

      {/* Latest News */}
      <HomeSection title="Latest News" linkTo="/news">
        {latestNews.length === 0 ? (
          <p className="text-muted-foreground">Loading news...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestNews.map((news, i) => (
              <ContentCard
                key={i}
                title={news.title}
                description={news.description}
                date={news.date}
                link={news.link}
                badge={news.category}
                image={news.image}
                source={news.source}
                external
                className="hover:shadow-md transition-shadow duration-200 hover:border-blue-200 dark:hover:border-blue-800"
              />
            ))}
          </div>
        )}
      </HomeSection>

      {/* Mini Reports */}
      <HomeSection title="Recent Mini-Reports" linkTo="/mini-reports">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {miniReports.map((report) => (
            <ContentCard
              key={report.id}
              title={report.title}
              description={report.description}
              date={report.date}
              tags={report.tags}
              link={report.link}
            />
          ))}
        </div>
      </HomeSection>

      {/* Research Spotlights */}
      <HomeSection title="Threat Actor Spotlights" linkTo="/research">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threatProfiles.map((profile) => (
            <ContentCard
              key={profile.id}
              title={profile.title}
              description={profile.description}
              link={profile.link}
            />
          ))}
        </div>
      </HomeSection>

      {/* Footer */}
      <CyberFooterPulse />
    </div>
  );
};

export default Index;
