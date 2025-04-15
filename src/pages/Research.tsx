import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Filter, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/Modal";
import ReactMarkdown from "react-markdown";

/* ---------------------------------------------
   Types
---------------------------------------------- */
type Victim = {
  victim: string;
  group: string;
  attackdate: string;
  country: string;
  activity: string;
  claim_url: string;
};

type ThreatActor = {
  title: string;
  content: string;
};

type CyberPaper = {
  id: string;              // arXiv ID or local ID
  title: string;
  abstract: string;
  authors: string[];
  published: string;       // date
  link: string;            // link to PDF or details
};

type CyberAttack = {
  date: string;
  summary: string;
  source?: string;
};

type CertEntry = {
  contact: string;
  url: string;
};

/* ---------------------------------------------
   Hardcoded Actor Spotlights
---------------------------------------------- */
const modalContent: Record<string, ThreatActor> = {
  RansomHouse: {
    title: "RansomHouse",
    content: `**RansomHouse** claimed responsibility for the March 2025 breach of Loretto Hospital in Chicago, stealing 1.5TB of sensitive medical data.

RansomHouse primarily conducts data exfiltration attacks rather than using traditional ransomware. Their tactics have led them to target healthcare organizations like Loretto Hospital in Chicago. The group demands payment for not leaking stolen data.

### Indicators of Compromise (IOCs)
**Hashes:**
- SHA256: 2C1475F1B49A8B93A6C6217BE078392925535E084048BF04241E57A711F0F58E
- SHA256: 549A8BC04C0EA9C622BAC90B0607E3F4FD48CB5610601031E054CC622BAC90B0607E3F4FD48CB5610601031E054CC6340F8EBA5

**URLs:**
- \`XW7AU5PNWTL6LOZBSUDKMYD32N6GNQDNGITJDPPYBUDAN3X3PJGPMPID[.]ONION\`
- \`HXXP[:]//ZZF6L4WAVAYC2MVBZWETTBLCO2QODVE5SECTJQYWC6FUWKVCVJLUAMYD[.]ONION\`

**File Extensions:**
- .XVGV, .dump, .vab, .backup, .dmp

**Ransom Notes:**
- HowToRestore.txt

### Tactics, Techniques, and Procedures (TTPs)
- Exploits vulnerabilities, uses Mimikatz for credential dumping, and PowerShell for system discovery.
`,
  },
  LockBit: {
    title: "LockBit",
    content: `**LockBit** remains one of the most active ransomware groups globally. Several manufacturing and logistics companies in the Midwest have been recent victims.

Known for using the **Ransomware-as-a-Service (RaaS)** model, LockBit attacks have affected multiple sectors. In the Midwest, LockBit targeted companies like CDW and government agencies in Illinois.

### Indicators of Compromise (IOCs)
**Command Line Parameters:**
- \`-del\`: Self-delete
- \`-gdel\`: Remove LockBit 3.0 group policy changes

**File Path Locations:**
- ADMIN$\\Temp\\<LockBit3.0 Filename>.exe
- %SystemRoot%\\Temp\\<LockBit3.0 Filename>.exe

**Registry Artifacts:**
- HKCU\\Control Panel\\Desktop\\WallPaper: (Default) C:\\ProgramData\\<Malware Extension>.bmp

**Mutex:**
- Global<MD4 hash of machine GUID>

### Tactics, Techniques, and Procedures (TTPs)
- Known for targeting critical infrastructure, leveraging advanced evasion techniques, and using tools like PowerShell.
`,
  },
};

/* ---------------------------------------------
   Component
---------------------------------------------- */
export default function Research() {
  // threat actors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorDetails, setActorDetails] = useState<ThreatActor | null>(null);

  // recent ransomware victims
  const [victims, setVictims] = useState<Victim[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);

  // recent cyberattacks
  const [cyberAttacks, setCyberAttacks] = useState<CyberAttack[]>([]);

  // CERT/CSIRT
  const [certDirectory, setCertDirectory] = useState<CertEntry[]>([]);

  // "arXiv" style "papers" or local placeholders
  const [papers, setPapers] = useState<CyberPaper[]>([]);

  // loading states
  const [loadingVictims, setLoadingVictims] = useState(false);
  const [loadingAttacks, setLoadingAttacks] = useState(false);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [loadingPapers, setLoadingPapers] = useState(false);

  /* ---------------------------------------------
     Fetch Ransomware Victims (US-based)
     /api/ransomware?type=recentvictims
  ----------------------------------------------*/
  useEffect(() => {
    async function fetchVictims() {
      try {
        setLoadingVictims(true);
        const res = await fetch("/api/ransomware?type=recentvictims");
        const data = await res.json();
        // data is an array of victim objects
        // we only want ~30:
        setVictims(data.slice(0, 30));
      } catch (err) {
        console.error("Failed to fetch ransomware data", err);
      } finally {
        setLoadingVictims(false);
      }
    }
    fetchVictims();
  }, []);

  const uniqueSectors = Array.from(new Set(victims.map((v) => v.activity))).filter(Boolean);
  const filteredVictims = sectorFilter
    ? victims.filter((v) => v.activity === sectorFilter)
    : victims;

  /* ---------------------------------------------
     Fetch CyberAttacks
     /api/ransomware?type=cyberattacks
  ----------------------------------------------*/
  useEffect(() => {
    async function fetchAttacks() {
      try {
        setLoadingAttacks(true);
        const res = await fetch("/api/ransomware?type=cyberattacks");
        const data = await res.json();
        // transform or slice if needed
        // your /v2/recentcyberattacks might differ in shape
        // example shape below:
        const mapped = data.slice(0, 10).map((item: any) => ({
          date: item.date || "Unknown date",
          summary: item.title || "No summary",
          source: item.link,
        }));
        setCyberAttacks(mapped);
      } catch (err) {
        console.error("Failed to fetch cyberattacks", err);
      } finally {
        setLoadingAttacks(false);
      }
    }
    fetchAttacks();
  }, []);

  /* ---------------------------------------------
     Fetch CERT/CSIRT Directory
     /api/ransomware?type=certs
  ----------------------------------------------*/
  useEffect(() => {
    async function fetchCerts() {
      try {
        setLoadingCerts(true);
        const res = await fetch("/api/ransomware?type=certs");
        const data = await res.json();
        // each item might be shape: { contact, url }
        setCertDirectory(data.slice(0, 30));
      } catch (err) {
        console.error("Failed to fetch cert directory", err);
      } finally {
        setLoadingCerts(false);
      }
    }
    fetchCerts();
  }, []);

  /* ---------------------------------------------
     Fetch "Papers"
     For demonstration, let's do a simple local placeholders
     or you can call an arXiv search endpoint
  ----------------------------------------------*/
  useEffect(() => {
    async function fetchPapers() {
      try {
        setLoadingPapers(true);
        // Example: we call some local JSON or an arXiv-like endpoint
        // For now, just simulate placeholders:
        const dummy = [
          {
            id: "paper1",
            title: "Cybersecurity Dynamics",
            abstract:
              "An example excerpt from (url) on Cybersecurity Dynamics. A candidate scenario for the future of Cybersecurity synergy in higher ed.",
            authors: ["John Doe", "Alice Example"],
            published: "2025-02-10",
            link: "#",
          },
          {
            id: "paper2",
            title: "Novel Approach for Cybersecurity Workforce Development: A Course in Secure Design",
            abstract:
              "This paper discusses a unique approach taken by a midwestern university to incorporate threat modeling labs into a design course. The results show improved comprehension of the secure SDLC.",
            authors: ["Jane Researcher", "Bob Example"],
            published: "2025-04-01",
            link: "#",
          },
          {
            id: "paper3",
            title: "Building a Resilient Cybersecurity Posture: A Framework for Leveraging Prevent, Detect and Respond Functions and Law Enforcement Collaboration",
            abstract:
              "Explores how smaller organizations can use a mixture of frameworks like NIST CSF and MITRE ATT&CK, in collaboration with local LE and federal agencies, to reduce overall risk posture.",
            authors: ["Random Author"],
            published: "2025-03-15",
            link: "#",
          },
          {
            id: "paper4",
            title: "Cybersecurity Analytics: A Foundation for the Science of Cybersecurity",
            abstract:
              "Introduces the fundamentals of a data-driven approach to cybersecurity. The aim is bridging the gap between theoretical security models and real-world data-driven threat intelligence.",
            authors: ["X. Example", "Y. Another", "Z. Third"],
            published: "2025-03-20",
            link: "#",
          },
        ];
        // You might transform it or do real fetch from "arxiv" or any other source
        setPapers(dummy);
      } finally {
        setLoadingPapers(false);
      }
    }
    fetchPapers();
  }, []);

  // Handle "Actor" modal open
  function openActorModal(actorKey: string) {
    setActorDetails(modalContent[actorKey]);
    setIsModalOpen(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title / Intro */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-mono font-bold mb-4">Cyber Threat Research</h1>
        <p className="text-muted-foreground max-w-2xl">
          Ongoing investigation into threat actors, ransomware groups, and targeted campaigns
          affecting Illinois, the Midwest, and critical U.S. sectors.
        </p>
      </motion.div>

      {/* Threat Actor Spotlights */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">Threat Actor Spotlights</h2>
          <p className="text-sm text-muted-foreground">
            A closer look at APT groups and ransomware gangs known to target critical sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(modalContent).map((actor) => (
            <motion.div
              key={actor}
              className="border border-border p-4 rounded-md bg-muted/20 cursor-pointer hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openActorModal(actor)}
            >
              <h3 className="font-mono font-medium text-lg mb-1 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                {modalContent[actor].title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                {modalContent[actor].content.split("\n")[0]}
              </p>
              {/* Example label, no "View all" */}
              <Badge variant="secondary">
                {actor === "RansomHouse" ? "Healthcare" : "Manufacturing"}
              </Badge>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cyber Research Papers */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">Cybersecurity Research Papers</h2>
          <p className="text-sm text-muted-foreground">
            Explorations of advanced cybersecurity topics and community research.
          </p>
        </div>

        {loadingPapers ? (
          <p className="text-sm text-muted-foreground">Loading papers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map((paper) => (
              <motion.div
                key={paper.id}
                className="border border-border p-4 rounded-md bg-muted/20"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-mono font-medium text-lg mb-2 line-clamp-2">
                  {paper.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  Published: {paper.published}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                  {paper.abstract}
                </p>
                <div className="flex items-center text-xs text-primary hover:underline mt-auto">
                  <a href={paper.link} target="_blank" rel="noreferrer">
                    Read paper
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Cyberattacks */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">Recent Cyberattacks</h2>
          <p className="text-sm text-muted-foreground">
            Data pulled from our “cyberattacks” endpoint.
          </p>
        </div>

        {loadingAttacks ? (
          <p className="text-sm text-muted-foreground">Loading cyberattacks...</p>
        ) : cyberAttacks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cyberattacks found.</p>
        ) : (
          <div className="space-y-4">
            {cyberAttacks.map((attack, idx) => (
              <div
                key={idx}
                className="border border-border rounded-md p-4 bg-secondary/50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium font-mono text-lg">
                    {attack.summary}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {attack.date}
                  </span>
                </div>
                {attack.source && (
                  <a
                    href={attack.source}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-sm underline block mt-1"
                  >
                    More info
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Ransomware Activity */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-mono font-semibold">Recent Ransomware Activity</h2>
            <p className="text-sm text-muted-foreground">
              Filtered for US-based victims
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                {sectorFilter || "Filter Sector"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSectorFilter(null)}>
                All Sectors
              </DropdownMenuItem>
              {uniqueSectors.map((sector) => (
                <DropdownMenuItem key={sector} onClick={() => setSectorFilter(sector)}>
                  {sector}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loadingVictims ? (
          <p className="text-sm text-muted-foreground">Loading ransomware data...</p>
        ) : filteredVictims.length === 0 ? (
          <p className="text-sm text-muted-foreground">No records found in this sector.</p>
        ) : (
          <div className="space-y-4">
            {filteredVictims.map((v) => (
              <div
                key={v.victim}
                className="border border-border p-4 rounded-md bg-secondary/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-mono font-medium text-lg">{v.victim}</h3>
                  <Badge variant="outline">{v.group || "Unknown"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sector: <strong>{v.activity}</strong> • {v.attackdate}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={v.claim_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm underline"
                  >
                    View breach record
                  </a>
                  {v.claim_url?.includes(".onion") && (
                    <Badge variant="destructive" className="text-[11px]">
                      .onion link
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CERT/CSIRT Directory */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-semibold">CERT/CSIRT Directory</h2>
          <p className="text-sm text-muted-foreground">
            Aggregated from public data. Possibly large. Only partial listed here.
          </p>
        </div>

        {loadingCerts ? (
          <p className="text-sm text-muted-foreground">Loading CERT directory...</p>
        ) : certDirectory.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No CERT/CSIRT entries found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certDirectory.map((c, idx) => (
              <div
                key={idx}
                className="border border-border p-4 rounded-md bg-muted/20 space-y-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <p className="font-medium truncate">{c.contact}</p>
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  {c.url}
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Threat Actor Modal */}
      {actorDetails && (
        <Modal
          title={actorDetails.title}
          content={<ReactMarkdown>{actorDetails.content}</ReactMarkdown>}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
