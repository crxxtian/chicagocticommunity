
import { ContentCard } from "@/components/ContentCard";

// Mock data
const newsItems = [
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
  },
  {
    id: 4,
    title: "Chicago Tech Summit to Feature Cybersecurity Track",
    description: "The annual Chicago Tech Summit announced a dedicated cybersecurity track with speakers from leading organizations. Registration is now open.",
    date: "2025-04-06",
    link: "/news/4"
  },
  {
    id: 5,
    title: "CISA Issues Alert for Critical Infrastructure in Midwest",
    description: "CISA has issued a regional alert regarding potential cyber threats targeting critical infrastructure in the Midwest, including Chicago area utilities.",
    date: "2025-04-05",
    link: "/news/5"
  },
  {
    id: 6,
    title: "Chicago PD Expands Cyber Crime Unit",
    description: "The Chicago Police Department announced the expansion of its Cyber Crime Unit to better address the growing number of digital crimes affecting residents.",
    date: "2025-04-04",
    link: "/news/6"
  },
  {
    id: 7,
    title: "Local University Launches Cybersecurity Scholarship Program",
    description: "A major Chicago university has launched a new scholarship program aimed at increasing diversity in cybersecurity education and careers.",
    date: "2025-04-03",
    link: "/news/7"
  },
  {
    id: 8,
    title: "DDoS Attacks Disrupt Chicago Transit Authority Website",
    description: "The CTA website experienced intermittent outages due to distributed denial-of-service attacks. No operational systems were affected.",
    date: "2025-04-02",
    link: "/news/8"
  }
];

const News = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest cybersecurity news and events relevant to the Chicagoland area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((news) => (
          <ContentCard
            key={news.id}
            title={news.title}
            description={news.description}
            date={news.date}
            link={news.link}
          />
        ))}
      </div>
    </div>
  );
};

export default News;
