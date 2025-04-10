
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock data for mini-reports posts
const reportsData = [
  {
    id: "1",
    title: "Analysis: Chicago Financial Sector Threat Landscape",
    description: "Our security researchers analyzed recent threats targeting financial institutions in the Chicagoland area.",
    content: `
      <p>This report provides a comprehensive analysis of cyber threats specifically targeting financial institutions in the Chicago metropolitan area over the past six months. Our research team has observed a significant evolution in tactics, techniques, and procedures (TTPs) employed by threat actors targeting this sector.</p>
      
      <h2>Key Findings</h2>
      <p>Three main attack vectors have dominated the threat landscape:</p>
      
      <h3>1. Spear-Phishing Campaigns</h3>
      <p>Highly targeted spear-phishing emails continue to be the primary initial access vector. Recent campaigns have shown sophisticated social engineering tactics, including:</p>
      <ul>
        <li>Impersonation of financial regulatory bodies specific to Illinois</li>
        <li>References to Chicago-based events and conferences</li>
        <li>Exploitation of merger and acquisition news relevant to local financial institutions</li>
      </ul>
      <p>These emails typically deliver custom malware loaders designed to evade detection by local security vendors. Analysis of malware samples indicates a connection to financially-motivated threat groups previously associated with campaigns targeting East Coast financial institutions.</p>
      
      <h3>2. Credential Stuffing Attacks</h3>
      <p>We've observed a 43% increase in credential stuffing attacks against online banking portals of Chicago-based financial institutions. These attacks are characterized by:</p>
      <ul>
        <li>Use of residential proxies to bypass geolocation restrictions</li>
        <li>Sophisticated CAPTCHA bypass techniques</li>
        <li>Low-and-slow methodology to avoid triggering rate limiting defenses</li>
      </ul>
      <p>In several cases, successful compromises led to fraudulent wire transfers targeting business accounts, with losses averaging $267,000 per incident.</p>
      
      <h3>3. Supply Chain Compromises</h3>
      <p>Perhaps most concerning is the rise in supply chain attacks affecting financial technology vendors serving Chicago's financial sector. Three significant incidents involved:</p>
      <ul>
        <li>Compromise of a local payment processing service provider</li>
        <li>Backdoored update to a widely-used compliance management solution</li>
        <li>Strategic web compromises targeting financial industry events in Chicago</li>
      </ul>
      
      <h2>Recommendations</h2>
      <p>Based on our analysis, we recommend financial institutions in the Chicago area implement the following measures:</p>
      <ol>
        <li>Deploy DMARC, SPF, and DKIM with enforcement policies to reduce email-based threats</li>
        <li>Implement adaptive multi-factor authentication for customer and employee access</li>
        <li>Establish enhanced monitoring for authentication anomalies</li>
        <li>Develop and test incident response procedures specific to wire fraud scenarios</li>
        <li>Conduct security assessments of third-party service providers with access to sensitive systems</li>
      </ol>
      
      <h2>Threat Forecast</h2>
      <p>Looking ahead to the next quarter, our analysis indicates:</p>
      <ul>
        <li>Continued targeting of Chicago's financial sector by organized crime groups</li>
        <li>Potential increase in destructive attacks designed to distract from fraudulent transactions</li>
        <li>Growing use of deepfake technology in business email compromise attempts</li>
      </ul>
      
      <p>The CCTIC will continue to monitor these threats and provide updates as new information becomes available.</p>
    `,
    author: "CCTIC Financial Sector Research Team",
    date: "2025-04-06",
    tags: ["financial", "targeted-attacks", "spear-phishing", "fraud"],
    readTime: "10 min read",
    downloads: 352
  },
  {
    id: "2",
    title: "Emerging Threat: QR Code Phishing in Public Spaces",
    description: "Investigation into a new social engineering technique involving fraudulent QR codes placed in public locations around Chicago's downtown area.",
    content: `
      <p>Our security researchers have identified an emerging physical-digital hybrid attack targeting Chicago residents and visitors. Malicious actors are placing fraudulent QR codes in high-traffic public locations throughout the downtown area, primarily in tourist destinations, transportation hubs, and business districts.</p>
      
      <h2>Attack Methodology</h2>
      <p>This campaign operates through a sophisticated combination of physical and digital techniques:</p>
      
      <h3>Physical Component</h3>
      <ul>
        <li>Attackers create professional-looking stickers or posters containing QR codes</li>
        <li>These are placed over legitimate QR codes (parking payment systems, restaurant menus, transit information) or in locations where QR codes would be expected</li>
        <li>Some include official-looking logos of Chicago institutions, transit authorities, or well-known businesses</li>
        <li>Distribution appears concentrated in areas with high tourist traffic and central business districts</li>
      </ul>
      
      <h3>Digital Component</h3>
      <ul>
        <li>When scanned, the QR codes direct victims to convincing phishing websites</li>
        <li>Sites are designed to mimic legitimate Chicago services (parking payment, transit passes, local attraction tickets)</li>
        <li>Many sites employ geolocation detection to only display phishing content to users in the Chicago area</li>
        <li>Victims are prompted to enter payment information, login credentials, or personal data</li>
      </ul>
      
      <h2>Observed Locations</h2>
      <p>Our team has documented fraudulent QR codes in the following areas:</p>
      <ul>
        <li>Millennium Park vicinity</li>
        <li>Navy Pier entrances</li>
        <li>CTA stations (particularly Clark/Lake, Washington/Wells, and Roosevelt)</li>
        <li>Street parking pay stations in the Loop and River North</li>
        <li>Popular restaurant districts in West Loop and Streeterville</li>
      </ul>
      
      <h2>Technical Indicators</h2>
      <p>Analysis of the phishing infrastructure revealed:</p>
      <ul>
        <li>Use of recently registered domains with names resembling legitimate Chicago services</li>
        <li>Hosting on bulletproof infrastructure primarily based in Eastern Europe</li>
        <li>Implementation of cloaking techniques to evade security scanners</li>
        <li>Stolen SSL certificates to display the HTTPS padlock</li>
      </ul>
      
      <h2>Recommendations</h2>
      <ol>
        <li>Verify QR codes before scanning (look for signs of tampering or stickers placed over existing codes)</li>
        <li>Check the URL preview before opening the link</li>
        <li>Use direct website navigation or official apps instead of QR codes for sensitive transactions</li>
        <li>Never enter payment information on sites accessed through unexpected QR codes</li>
        <li>Report suspicious QR codes to the establishment and local authorities</li>
      </ol>
      
      <h2>For Businesses</h2>
      <ol>
        <li>Regularly inspect QR codes displayed on your premises</li>
        <li>Consider using QR codes printed directly on materials rather than stickers when possible</li>
        <li>Implement alternative verification methods (e.g., NFC, direct app links)</li>
        <li>Train staff to recognize signs of QR code tampering</li>
      </ol>
      
      <p>The Chicago Police Department and FBI have been notified of this campaign. If you encounter suspicious QR codes or believe you've been a victim, report it to law enforcement and the CCTIC.</p>
    `,
    author: "CCTIC Social Engineering Research Team",
    date: "2025-04-05",
    tags: ["phishing", "social-engineering", "qr-codes", "physical-security"],
    readTime: "8 min read",
    downloads: 289
  }
];

const MiniReportPost = () => {
  const { id } = useParams<{ id: string }>();
  const report = reportsData.find(report => report.id === id);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-mono font-medium mb-6">Report Not Found</h1>
        <p className="mb-8">The mini-report you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/mini-reports">Return to Mini-Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/mini-reports" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mini-Reports
        </Link>
      </div>

      <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-3xl sm:text-4xl font-mono font-bold mb-4">{report.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              <span>{report.date}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1 text-purple-500" />
              <span>{report.readTime}</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1 text-emerald-500" />
              <span>{report.downloads} downloads</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {report.tags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="p-4 bg-secondary/50 rounded-md border border-border mb-8">
            <p className="font-medium m-0">{report.description}</p>
          </div>
        </header>

        <div dangerouslySetInnerHTML={{ __html: report.content }} />
        
        <div className="mt-12 not-prose">
          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Prepared by: {report.author}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default MiniReportPost;
