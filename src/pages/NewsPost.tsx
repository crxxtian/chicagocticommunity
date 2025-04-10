
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for news posts
const newsPostsData = [
  {
    id: "1",
    title: "New Phishing Campaign Targeting Local Businesses",
    description: "Attackers impersonating ComEd are sending malicious emails to businesses in the Chicago area.",
    content: `
      <p>A sophisticated phishing campaign has been identified targeting businesses throughout the Chicagoland area. The threat actors are impersonating ComEd, the largest electric utility in Illinois, sending emails that claim to contain urgent billing information or service disruption notices.</p>
      
      <p>The emails contain malicious attachments disguised as invoices or PDF documents that, when opened, attempt to install malware designed to steal credentials or provide remote access to the victim's system.</p>
      
      <h2>Indicators of Compromise</h2>
      <ul>
        <li>Sender email addresses using domains such as comed-billing.com, comed-notices.net, or similar variations</li>
        <li>Subject lines containing urgent language about billing discrepancies or service interruptions</li>
        <li>Attachments with names like "ComEd_Invoice_[random number].pdf.exe" or "Service_Notice_[date].doc"</li>
      </ul>
      
      <h2>Recommendations</h2>
      <p>Organizations are advised to implement the following security measures:</p>
      <ol>
        <li>Enhance email filtering to detect spoofed domains and suspicious attachments</li>
        <li>Train employees to identify phishing attempts and verify sender information</li>
        <li>Implement multi-factor authentication for email and financial systems</li>
        <li>Verify any unexpected communications from utilities through official channels</li>
      </ol>
      
      <p>ComEd has confirmed they never send unexpected emails with executable attachments and have been notified of this campaign. They are working with law enforcement to identify the source of these attacks.</p>
    `,
    author: "CCTIC Security Team",
    date: "2025-04-09",
    category: "Phishing",
    readTime: "4 min read",
    views: 1243
  },
  {
    id: "2",
    title: "Critical Windows Vulnerability Patched",
    description: "Microsoft released an emergency patch for a zero-day vulnerability being actively exploited.",
    content: `
      <p>Microsoft has released an emergency out-of-band security update to address a critical zero-day vulnerability in the Windows operating system that is being actively exploited in targeted attacks. The vulnerability, tracked as CVE-2025-21458, affects all supported versions of Windows and allows attackers to execute arbitrary code with SYSTEM privileges.</p>

      <p>This vulnerability is particularly concerning as it requires minimal user interaction - simply previewing a malicious file in Windows Explorer is sufficient to trigger the exploit. Several Chicago-based organizations have already reported being targeted.</p>

      <h2>Technical Details</h2>
      <p>The vulnerability exists in the Windows Print Spooler service, which fails to properly validate user input before passing it to sensitive functions. Attackers can craft special documents that, when processed by the Print Spooler (even in preview mode), can execute code with elevated privileges.</p>

      <h2>Exploit Activity</h2>
      <p>Security researchers have observed the vulnerability being exploited by multiple threat actors, including state-sponsored APT groups. Attack vectors include:</p>
      <ul>
        <li>Malicious document attachments in phishing emails</li>
        <li>Compromised websites hosting malicious files</li>
        <li>Drive-by downloads through advertising networks</li>
      </ul>

      <h2>Mitigation</h2>
      <p>Organizations are strongly encouraged to apply the security update immediately. If patching is not immediately possible, consider these temporary mitigations:</p>
      <ol>
        <li>Disable the Print Spooler service on systems where printing is not required</li>
        <li>Block outbound SMB traffic at the network boundary</li>
        <li>Implement application control policies to prevent unauthorized executable files</li>
      </ol>

      <p>The CCTIC will continue to monitor exploitation attempts targeting Chicago-area organizations and will provide updates as more information becomes available.</p>
    `,
    author: "CCTIC Research Team",
    date: "2025-04-08",
    category: "Vulnerabilities",
    readTime: "5 min read",
    views: 2891
  },
  {
    id: "3",
    title: "Ransomware Attack Affects Local Healthcare Provider",
    description: "A Chicago-based healthcare provider is recovering from a targeted ransomware attack.",
    content: `
      <p>A mid-sized healthcare provider in the Chicago metropolitan area is currently recovering from a targeted ransomware attack that has impacted its patient scheduling systems and electronic health records. The attack, which began late last week, has forced the organization to revert to paper-based processes for patient care.</p>

      <p>The ransomware group behind the attack, identified as BlackMamba, is known for double-extortion tactics - encrypting victims' data and threatening to publish sensitive information unless a ransom is paid. According to sources familiar with the incident, the attackers are demanding $2.3 million in cryptocurrency.</p>

      <h2>Attack Timeline</h2>
      <p>Based on information shared by the affected organization and our analysis:</p>
      <ul>
        <li>Initial access was gained approximately three weeks ago through a phishing email targeting an IT administrator</li>
        <li>The threat actors maintained persistence in the network while conducting reconnaissance</li>
        <li>Lateral movement occurred over several days, eventually reaching domain controllers</li>
        <li>Data exfiltration began before encryption to support the double-extortion scheme</li>
        <li>Encryption was triggered during weekend hours to maximize impact and minimize immediate response</li>
      </ul>

      <h2>Industry Impact</h2>
      <p>This incident highlights the continued targeting of healthcare organizations by ransomware groups. Healthcare remains a high-value target due to the critical nature of services and the sensitivity of data stored.</p>

      <h2>Recommendations</h2>
      <p>The CCTIC recommends that healthcare organizations in the area:</p>
      <ol>
        <li>Review network segmentation between clinical and administrative systems</li>
        <li>Implement offline backups for critical patient data</li>
        <li>Develop and regularly test incident response procedures specific to ransomware scenarios</li>
        <li>Establish relationships with law enforcement and information sharing partners before incidents occur</li>
      </ol>

      <p>The Chicago FBI field office has been engaged and is assisting with the investigation. The affected provider has not disclosed whether they intend to pay the ransom.</p>
    `,
    author: "CCTIC Response Team",
    date: "2025-04-07",
    category: "Ransomware",
    readTime: "6 min read",
    views: 1879
  }
];

const NewsPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = newsPostsData.find(post => post.id === id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-mono font-medium mb-6">News Post Not Found</h1>
        <p className="mb-8">The news post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/news">Return to News</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/news" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Link>
      </div>

      <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-3xl sm:text-4xl font-mono font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1 text-purple-500" />
              <span>{post.category}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-emerald-500" />
              <span>{post.views} views</span>
            </div>
            <div>{post.readTime}</div>
          </div>
          
          <div className="p-4 bg-secondary/50 rounded-md border border-border mb-8">
            <p className="font-medium m-0">{post.description}</p>
          </div>
        </header>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="mt-12 not-prose flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Posted by: {post.author}</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </article>
    </div>
  );
};

export default NewsPost;
