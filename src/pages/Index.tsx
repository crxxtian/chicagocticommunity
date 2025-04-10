
import { ContentCard } from "@/components/ContentCard";
import { HomeSection } from "@/components/HomeSection";

// Mock data
const latestNews = [
  {
    id: 1,
    title: "New Phishing Campaign Targeting Local Businesses",
    description: "Attackers impersonating ComEd are sending malicious emails to businesses in the Chicago area. Learn what to watch for.",
    date: "2025-04-09",
    link: "/news/1"
  },
  {
    id: 2,
    title: "Critical Windows Vulnerability Patched",
    description: "Microsoft released an emergency patch for a zero-day vulnerability being actively exploited. Update systems immediately.",
    date: "2025-04-08",
    link: "/news/2"
  },
  {
    id: 3,
    title: "Ransomware Attack Affects Local Healthcare Provider",
    description: "A Chicago-based healthcare provider is recovering from a targeted ransomware attack that impacted patient scheduling systems.",
    date: "2025-04-07",
    link: "/news/3"
  }
];

const miniReports = [
  {
    id: 1,
    title: "Analysis: Chicago Financial Sector Threat Landscape",
    description: "Our security researchers analyzed recent threats targeting financial institutions in the Chicagoland area. The report identifies common attack vectors and provides mitigation strategies.",
    date: "2025-04-06",
    tags: ["financial", "targeted-attacks"],
    link: "/mini-reports/1"
  },
  {
    id: 2,
    title: "Emerging Threat: QR Code Phishing in Public Spaces",
    description: "Investigation into a new social engineering technique involving fraudulent QR codes placed in public locations around Chicago's downtown area.",
    date: "2025-04-05",
    tags: ["phishing", "social-engineering"],
    link: "/mini-reports/2"
  }
];

const discussions = [
  {
    id: 1,
    title: "Best Practices for SMB Security with Limited Budget",
    description: "26 posts • Last updated 2 hours ago",
    link: "/discussions/1"
  },
  {
    id: 2,
    title: "Chicago Security Meetups - April 2025",
    description: "14 posts • Last updated yesterday",
    link: "/discussions/2"
  },
  {
    id: 3,
    title: "Advice Needed: Incident Response Plan for Startups",
    description: "32 posts • Last updated 3 days ago",
    link: "/discussions/3"
  }
];

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4">
          Chicago Cyber Threat Intelligence Community
        </h1>
        <p className="text-lg text-muted-foreground">
          Cyber Threat Intel for Chicagoland
        </p>
      </div>

      <div className="mb-10 p-6 border border-border rounded-md bg-secondary/30">
        <p>
          Welcome to the Chicago Cyber Threat Intelligence Community (CCTIC) - a platform for cybersecurity professionals in the Chicagoland area to share intelligence, discuss emerging threats, and collaborate on defensive strategies. Our mission is to strengthen our local security posture through information sharing and community engagement.
        </p>
      </div>

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
    </div>
  );
};

export default Index;
