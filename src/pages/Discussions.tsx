
import { ContentCard } from "@/components/ContentCard";

// Mock data
const discussions = [
  {
    id: 1,
    title: "Best Practices for SMB Security with Limited Budget",
    description: "26 posts • Last updated 2 hours ago",
    category: "Best Practices",
    link: "/discussions/1"
  },
  {
    id: 2,
    title: "Chicago Security Meetups - April 2025",
    description: "14 posts • Last updated yesterday",
    category: "Community",
    link: "/discussions/2"
  },
  {
    id: 3,
    title: "Advice Needed: Incident Response Plan for Startups",
    description: "32 posts • Last updated 3 days ago",
    category: "Incident Response",
    link: "/discussions/3"
  },
  {
    id: 4,
    title: "Chicago-based CTI Sharing Initiatives",
    description: "19 posts • Last updated 4 days ago",
    category: "Threat Intelligence",
    link: "/discussions/4"
  },
  {
    id: 5,
    title: "Analyzing Recent Phishing Campaigns in Chicagoland",
    description: "41 posts • Last updated 5 days ago",
    category: "Threats & Vulnerabilities",
    link: "/discussions/5"
  },
  {
    id: 6,
    title: "Job Opportunities: Security Analysts in Chicago (April 2025)",
    description: "28 posts • Last updated 6 days ago",
    category: "Career Development",
    link: "/discussions/6"
  },
  {
    id: 7,
    title: "Local MSSP Recommendations",
    description: "23 posts • Last updated 1 week ago",
    category: "Vendors & Services",
    link: "/discussions/7"
  },
  {
    id: 8,
    title: "Chicago's New Data Protection Ordinance - Compliance Discussion",
    description: "37 posts • Last updated 1 week ago",
    category: "Compliance & Regulations",
    link: "/discussions/8"
  },
  {
    id: 9,
    title: "Recommended Security Training for Non-technical Staff",
    description: "17 posts • Last updated 2 weeks ago",
    category: "Training & Education",
    link: "/discussions/9"
  },
  {
    id: 10,
    title: "Local Government Security Posture Assessment",
    description: "31 posts • Last updated 2 weeks ago",
    category: "Public Sector",
    link: "/discussions/10"
  }
];

// Group discussions by category
const groupedDiscussions = discussions.reduce((acc, discussion) => {
  if (!acc[discussion.category]) {
    acc[discussion.category] = [];
  }
  acc[discussion.category].push(discussion);
  return acc;
}, {} as Record<string, typeof discussions>);

const Discussions = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">Discussions</h1>
        <p className="text-muted-foreground">
          Join conversations about cybersecurity topics relevant to the Chicago area.
        </p>
      </div>
      
      {Object.entries(groupedDiscussions).map(([category, discussions]) => (
        <div key={category} className="mb-10">
          <h2 className="text-xl font-mono font-medium mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discussions.map((discussion) => (
              <ContentCard
                key={discussion.id}
                title={discussion.title}
                description={discussion.description}
                link={discussion.link}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Discussions;
