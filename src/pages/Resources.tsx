
import { Link } from "react-router-dom";
import { FileText, Link as LinkIcon, Download } from "lucide-react";

// Mock data
const resources = [
  {
    id: 1,
    title: "Chicago Cybersecurity Resource Guide",
    description: "A comprehensive guide to cybersecurity resources available in the Chicago area, including government services, educational programs, and community organizations.",
    type: "pdf",
    link: "#"
  },
  {
    id: 2,
    title: "CISA Regional Office - Chicago",
    description: "Contact information and services provided by the Cybersecurity and Infrastructure Security Agency's Chicago regional office.",
    type: "link",
    link: "https://www.cisa.gov/"
  },
  {
    id: 3,
    title: "Incident Response Template for Small Businesses",
    description: "A customizable template for developing an incident response plan tailored to small businesses in the Chicago area.",
    type: "doc",
    link: "#"
  },
  {
    id: 4,
    title: "Chicago Threat Intelligence Sharing Protocol",
    description: "Documentation on how to participate in the local threat intelligence sharing initiative, including technical requirements and participation guidelines.",
    type: "pdf",
    link: "#"
  },
  {
    id: 5,
    title: "Illinois Attorney General - Data Breach Reporting",
    description: "Official information on data breach reporting requirements for organizations operating in Illinois.",
    type: "link",
    link: "https://illinoisattorneygeneral.gov/"
  },
  {
    id: 6,
    title: "Chicagoland Security Conference Calendar",
    description: "A regularly updated calendar of cybersecurity conferences, workshops, and training events in the Chicago metropolitan area.",
    type: "xlsx",
    link: "#"
  },
  {
    id: 7,
    title: "Security Vendor Assessment Questionnaire",
    description: "A standardized questionnaire for evaluating the security posture of vendors and service providers.",
    type: "doc",
    link: "#"
  },
  {
    id: 8,
    title: "Chicago ISAC (Information Sharing and Analysis Center)",
    description: "Information about the local ISAC and how to become a member to participate in threat intelligence sharing.",
    type: "link",
    link: "#"
  },
  {
    id: 9,
    title: "Cybersecurity Workforce Development Guide",
    description: "Resources for organizations looking to develop cybersecurity talent within their teams, including local educational programs and internship opportunities.",
    type: "pdf",
    link: "#"
  },
  {
    id: 10,
    title: "Chicago Public Sector Security Guidelines",
    description: "Security guidelines and best practices for public sector organizations in Chicago.",
    type: "pdf",
    link: "#"
  }
];

const getIconForResourceType = (type: string) => {
  switch (type) {
    case 'link':
      return <LinkIcon className="h-5 w-5" />;
    case 'pdf':
    case 'doc':
    case 'xlsx':
      return <FileText className="h-5 w-5" />;
    default:
      return <Download className="h-5 w-5" />;
  }
};

const Resources = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">Resources</h1>
        <p className="text-muted-foreground">
          Access valuable cybersecurity resources, tools, and documentation relevant to the Chicago area.
        </p>
      </div>

      <div className="space-y-6">
        {resources.map((resource) => (
          <div 
            key={resource.id} 
            className="border border-border rounded-md p-4 hover:bg-secondary/50 transition-colors"
          >
            <Link to={resource.link} className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-secondary rounded-md">
                {getIconForResourceType(resource.type)}
              </div>
              <div>
                <h3 className="font-mono font-medium text-lg mb-1">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                <div className="flex items-center text-sm">
                  <span className="uppercase text-xs font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded">
                    {resource.type}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
