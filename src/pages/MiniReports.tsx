
import { ContentCard } from "@/components/ContentCard";

const reports = [
  {
    "id": 1,
    "title": "Chicago Public Schools Data Breach Exposes Student Information",
    "description": "In March 2025, Chicago Public Schools (CPS) reported a data breach involving a vendor's server that exposed personal information of approximately 700,000 current and former students. The compromised data included names, dates of birth, genders, and student ID numbers. CPS has notified affected families and is working with law enforcement to investigate the incident.",
    "date": "2025-03-07",
    "tags": ["education", "data breach", "student information"],
    "link": "https://chicago.suntimes.com/education/2025/03/08/cps-data-breach-security-technology"
  },
  {
    "id": 2,
    "title": "SRAM Investigates Cybersecurity Incident Affecting IT Systems",
    "description": "In April 2025, Chicago-based bicycle component manufacturer SRAM experienced an IT systems outage due to a cybersecurity issue. The company engaged external specialists to investigate the incident and assess its impact on operations. While specific details remain undisclosed, SRAM has restored affected systems and continues to monitor for any further issues.",
    "date": "2025-04-01",
    "tags": ["manufacturing", "cybersecurity", "IT outage"],
    "link": "https://www.bicycleretailer.com/industry-news/2025/04/01/sram-still-investigating-cybersecurity-issue"
  },
  {
    "id": 3,
    "title": "RansomHouse Gang Claims Attack on Loretto Hospital",
    "description": "In March 2025, the RansomHouse cybercriminal group claimed responsibility for a cyberattack on Loretto Hospital in Chicago, alleging the theft of 1.5TB of sensitive data. The hospital is a not-for-profit community-focused healthcare provider offering various medical services. Details about the specific data compromised have not been fully disclosed.",
    "date": "2025-03-10",
    "tags": ["healthcare", "ransomware", "data breach"],
    "link": "https://securityaffairs.com/175187/cyber-crime/ransomhouse-gang-claims-the-hack-of-the-loretto-hospital-in-chicago.html"
  },
  {
    "id": 4,
    "title": "Skender Construction Reports Ransomware Attack",
    "description": "In April 2024, Chicago-based Skender Construction disclosed a ransomware attack affecting over 1,000 individuals. The breach potentially exposed personal information, including names, addresses, Social Security numbers, and health information. The company has notified affected individuals and is offering support services.",
    "date": "2024-04-10",
    "tags": ["construction", "ransomware", "data breach"],
    "link": "https://www.constructiondive.com/news/skender-ransomware-attack-chicago-maine/712844/"
  },
  {
    "id": 5,
    "title": "Lurie Children's Hospital Suffers Cyberattack",
    "description": "In February 2024, Lurie Children's Hospital in Chicago experienced a cyberattack that forced the hospital to disconnect its entire network. The incident led to significant disruptions in hospital operations as officials worked to restore systems and ensure patient safety.",
    "date": "2024-02-02",
    "tags": ["healthcare", "cyberattack", "network outage"],
    "link": "https://therecord.media/lurie-childrens-hospital-chicago-cyberattack"
  }
]


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
            link={`/mini-reports/${report.id}`}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default MiniReports;
