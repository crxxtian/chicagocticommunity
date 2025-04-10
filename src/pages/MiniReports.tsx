
import { ContentCard } from "@/components/ContentCard";

// Mock data
const reports = [
  {
    id: 1,
    title: "Analysis: Chicago Financial Sector Threat Landscape",
    description: "Our security researchers analyzed recent threats targeting financial institutions in the Chicagoland area. This report identifies common attack vectors including spear-phishing campaigns targeting executives, credential stuffing attacks against online banking portals, and a rise in supply chain compromises affecting financial technology vendors. We recommend implementing enhanced email authentication protocols, multi-factor authentication, and regular third-party security assessments.",
    date: "2025-04-06",
    tags: ["financial", "targeted-attacks"],
    link: "/mini-reports/1"
  },
  {
    id: 2,
    title: "Emerging Threat: QR Code Phishing in Public Spaces",
    description: "Investigation into a new social engineering technique involving fraudulent QR codes placed in public locations around Chicago's downtown area. Attackers are placing malicious QR codes over legitimate ones in popular tourist areas and transit stations. When scanned, these codes direct victims to convincing phishing pages that steal credentials and financial information. The campaign appears to be specifically targeting visitors to Chicago, exploiting their unfamiliarity with local services. Businesses should regularly inspect QR codes on their premises and implement alternative verification methods.",
    date: "2025-04-05",
    tags: ["phishing", "social-engineering"],
    link: "/mini-reports/2"
  },
  {
    id: 3,
    title: "Ransomware Trends Affecting Chicagoland Manufacturing",
    description: "This report examines the increasing ransomware attacks targeting manufacturing companies in the Chicago metropolitan area. Over the past quarter, we've observed a 37% increase in ransomware incidents affecting small to medium-sized manufacturers, particularly those in the automotive and food processing sectors. The threat actors are exploiting vulnerabilities in internet-facing OT systems and legacy infrastructure. The average ransom demand has increased to $350,000, and threat actors are increasingly using double-extortion tactics. We recommend segmenting OT/IT networks, implementing robust backup strategies, and developing incident response plans specific to ransomware scenarios.",
    date: "2025-04-04",
    tags: ["ransomware", "manufacturing", "OT"],
    link: "/mini-reports/3"
  },
  {
    id: 4,
    title: "Chicago Public Wi-Fi Security Assessment",
    description: "Our team conducted security assessments of public Wi-Fi networks across 15 popular locations in Chicago, including coffee shops, libraries, and public squares. Findings indicate that 60% of these networks lacked proper encryption, 45% were vulnerable to man-in-the-middle attacks, and 30% showed evidence of previously deployed rogue access points. Users connecting to these networks are at significant risk of credential theft and data interception. We've reported our findings to the network operators and city officials with recommendations for improving security configurations. Until improvements are made, we recommend Chicago residents use cellular data or personal VPNs when working in public.",
    date: "2025-04-02",
    tags: ["wifi", "public-infrastructure", "mitm"],
    link: "/mini-reports/4"
  },
  {
    id: 5,
    title: "Insider Threat Indicators in Healthcare Settings",
    description: "Based on recent incidents at Chicago-area healthcare facilities, this report identifies key indicators of insider threats in medical settings. We analyzed patterns from five incidents occurring between January and March 2025, involving data exfiltration and patient record access. Common indicators included after-hours system access, bulk downloading of patient records, and access to records without corresponding patient appointments. We recommend healthcare organizations implement behavioral analytics, strict role-based access controls, and regular privilege reviews. The report includes a MITRE ATT&CK mapping of the techniques observed in these incidents to assist security teams in detection and prevention efforts.",
    date: "2025-03-28",
    tags: ["insider-threat", "healthcare", "data-protection"],
    link: "/mini-reports/5"
  }
];

const MiniReports = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">Mini-Reports</h1>
        <p className="text-muted-foreground">
          Brief analytical reports on cyber threats and security incidents relevant to the Chicago area.
        </p>
      </div>

      <div className="space-y-6">
        {reports.map((report) => (
          <ContentCard
            key={report.id}
            title={report.title}
            description={report.description}
            date={report.date}
            tags={report.tags}
            link={report.link}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default MiniReports;
