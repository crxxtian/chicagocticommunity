import { motion } from "framer-motion";
import { ContentCard } from "@/components/ContentCard";
import { HomeSection } from "@/components/HomeSection";
import { CyberFooterPulse } from "@/components/CyberFooterPulse";

const latestNews = [
  {
    id: 1,
    title: "Avoid Those Road Toll Texts! Officials Issue Warnings About Smishing Scam",
    description:
      "Officials have issued a warning about a growing smishing scam targeting Chicago-area tollway customers. The scam sends fraudulent texts asking for payment information.",
    date: "2025-03-13",
    link: "https://news.wttw.com/2025/03/13/don-t-click-those-road-toll-texts-officials-issue-warnings-about-smishing-scam",
  },
  {
    id: 2,
    title: "AkiraBot Targets 420,000 Sites with OpenAI-Generated Spam, Bypassing CAPTCHA Protections",
    description:
      "Researchers disclosed AkiraBot, an AI-powered spamming system that bypasses CAPTCHAs and targets over 420,000 websites globally.",
    date: "2025-04-10",
    link: "https://thehackernews.com/2025/04/akirabot-targets-420000-sites-with.html",
  },
  {
    id: 3,
    title: "Congress Faces Crucial Decision on Cybersecurity Information Sharing Act Renewal",
    description:
      "A Congressional Research Service report warns of potential lapses as the Cybersecurity Information Sharing Act nears expiration in September.",
    date: "2025-04-10",
    link: "https://industrialcyber.co/news/congress-faces-crucial-decision-on-renewing-cybersecurity-information-sharing-act-before-september-expiry-crs-reports/",
  },
];


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

// ✅ Discussion previews
const discussions = [
  {
    id: 1,
    title: "Addressing Cybersecurity Challenges in the Manufacturing Sector",
    description: "Strategies to mitigate cybersecurity risks in manufacturing, post-SRAM incident.",
    link: "/discussions/1",
  },
  {
    id: 2,
    title: "Enhancing Cybersecurity Training Programs",
    description: "Approaches to close training gaps across Chicagoland orgs and institutions.",
    link: "/discussions/2",
  },
  {
    id: 3,
    title: "Preparing for Emerging Cyber Threats",
    description: "Proactive community collaboration to defend against evolving threat actors.",
    link: "/discussions/3",
  },
];

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 🔹 Title & intro */}
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
          <strong>CCTIC is a hub for local collaboration, intel sharing, and defense strategy in the Chicagoland area.</strong>
        </p>
      </div>

      {/* 🔹 Welcome banner */}
      <div className="mb-10 p-6 border border-border rounded-md bg-secondary/30">
        <p className="font-medium text-muted-foreground">
          <strong>Welcome.</strong> Our mission is to improve Chicagoland’s cyber resilience through real-time threat sharing, expert analysis, and a local-first approach to community defense.
        </p>
      </div>

      {/* 🔹 News */}
      <HomeSection title="Latest News" linkTo="/news">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestNews.map((news) => (
            <ContentCard
              key={news.id}
              title={news.title}
              description={news.description}
              date={news.date}
              link={news.link}
            />
          ))}
        </div>
      </HomeSection>

      {/* 🔹 Mini Reports */}
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

      {/* 🔹 Discussions */}
      <HomeSection title="Discussion Highlights" linkTo="/discussions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {discussions.map((discussion) => (
            <ContentCard
              key={discussion.id}
              title={discussion.title}
              description={discussion.description}
              link={discussion.link}
            />
          ))}
        </div>
      </HomeSection>

      {/* 🔹 Footer animation */}
      <CyberFooterPulse />
    </div>
  );
};

export default Index;
