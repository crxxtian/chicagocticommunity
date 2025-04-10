
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MessageSquare, Calendar, ArrowUp, ArrowDown, Reply, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

// Mock data for discussion posts
const discussionsData = [
  {
    id: "1",
    title: "Best Practices for SMB Security with Limited Budget",
    category: "Best Practices",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      role: "Security Consultant"
    },
    date: "2025-04-08 14:32",
    content: `
      <p>I work with several small businesses in the Chicago area that want to improve their security posture but have very limited budgets. Most have fewer than 25 employees and don't have dedicated IT staff, let alone security personnel.</p>
      
      <p>I'd love to hear from the community what you consider the absolute essential security measures that provide the most protection for the least cost. What's your "if you can only do five things" list for small businesses?</p>
      
      <p>Some of the recommendations I typically make include:</p>
      <ol>
        <li>Implement MFA everywhere possible, especially email and financial accounts</li>
        <li>Use a password manager company-wide</li>
        <li>Enable automatic updates for all software</li>
        <li>Implement basic security awareness training (phishing, password security, etc.)</li>
        <li>Ensure regular offsite backups with testing</li>
      </ol>
      
      <p>What am I missing? What would you prioritize differently?</p>
    `,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Maria Garcia",
          avatar: "/placeholder.svg",
          role: "CISO, Midsize Healthcare"
        },
        date: "2025-04-08 15:10",
        content: `<p>Your list is solid as a starting point. I'd add a few things based on what I've seen working in healthcare:</p>
        <ul>
          <li>DNS filtering - relatively inexpensive and can prevent connections to known malicious domains</li>
          <li>Asset inventory - you can't protect what you don't know about</li>
          <li>Endpoint protection that includes EDR capabilities - prices have come down significantly</li>
        </ul>
        <p>For small businesses specifically in Chicago, I'd also recommend they look into the free resources offered by the Chicago Small Business Cyber Assistance program. They provide basic vulnerability assessments and security planning assistance for qualifying businesses.</p>`,
        votes: 12
      },
      {
        id: "1-2",
        author: {
          name: "David Wu",
          avatar: "/placeholder.svg",
          role: "Independent Security Researcher"
        },
        date: "2025-04-08 16:45",
        content: `<p>I'd emphasize the importance of network segmentation, even for small businesses. It doesn't have to be complex - just separating guest WiFi from the business network and implementing basic VLANs for different functions can significantly limit the damage from a compromise.</p>
        <p>Also, don't underestimate the value of a written incident response plan, even if it's just a few pages. When something happens, having basic procedures documented saves critical time.</p>`,
        votes: 8,
        replies: [
          {
            id: "1-2-1",
            author: {
              name: "Alex Johnson",
              avatar: "/placeholder.svg",
              role: "Security Consultant"
            },
            date: "2025-04-08 17:20",
            content: `<p>Great point about the incident response plan, David. Do you have any templates or resources you recommend for small businesses creating their first IR plan? Most of my clients get overwhelmed when they see comprehensive IR frameworks designed for larger organizations.</p>`,
            votes: 3
          },
          {
            id: "1-2-2",
            author: {
              name: "David Wu",
              avatar: "/placeholder.svg",
              role: "Independent Security Researcher"
            },
            date: "2025-04-08 18:05",
            content: `<p>Absolutely, Alex. The CISA small business IR template is a good starting point: [link removed]. It's only about 5 pages but covers the essentials.</p>
            <p>I also recommend focusing on just three scenarios to start: 1) Ransomware/destructive malware, 2) Business email compromise, and 3) Data theft. These cover the most common and impactful incidents for small businesses.</p>`,
            votes: 7
          }
        ]
      },
      {
        id: "1-3",
        author: {
          name: "Sarah Miller",
          avatar: "/placeholder.svg",
          role: "IT Director, Retail Chain"
        },
        date: "2025-04-09 09:15",
        content: `<p>One thing I've found extremely valuable is cultivating relationships with local law enforcement before an incident occurs. The Chicago FBI field office has a cyber division liaison specifically for small and medium businesses.</p>
        <p>Having that contact established ahead of time makes a huge difference if you need to report an incident. They can also provide threat intelligence specific to Chicago businesses that you won't get elsewhere.</p>
        <p>As for technical controls, I'd prioritize email security above almost everything else for small businesses. Most of the incidents we've responded to started there.</p>`,
        votes: 15
      }
    ],
    views: 423,
    lastUpdated: "2 hours ago"
  },
  {
    id: "2",
    title: "Chicago Security Meetups - April 2025",
    category: "Community",
    author: {
      name: "Robin Patel",
      avatar: "/placeholder.svg",
      role: "Community Manager"
    },
    date: "2025-04-04 10:15",
    content: `
      <p>Hello Chicago security community! I'm compiling a list of security-related meetups, workshops, and events happening in the Chicagoland area during April 2025.</p>
      
      <p>Please share any events you know about or are organizing. I'll update this post with a comprehensive calendar.</p>
      
      <p>So far I have:</p>
      <ul>
        <li><strong>April 12</strong> - Chicago OWASP Chapter Meeting (Loop) - "API Security Best Practices"</li>
        <li><strong>April 15</strong> - Cloud Security Alliance Meetup (West Loop) - "Zero Trust in Multi-Cloud Environments"</li>
        <li><strong>April 18</strong> - Chicago Cybersecurity Conference (McCormick Place)</li>
        <li><strong>April 22</strong> - Women in Cybersecurity Networking Event (River North)</li>
      </ul>
      
      <p>What else should be on this list?</p>
    `,
    replies: [
      {
        id: "2-1",
        author: {
          name: "Taylor Kim",
          avatar: "/placeholder.svg",
          role: "Security Engineer"
        },
        date: "2025-04-04 11:30",
        content: `<p>The Chicago Ethical Hackers Group is holding their monthly workshop on April 20th in Evanston. This month's focus is on IoT security testing. It's free to attend but requires registration: [link removed]</p>`,
        votes: 5
      },
      {
        id: "2-2",
        author: {
          name: "Michael Brooks",
          avatar: "/placeholder.svg",
          role: "Security Awareness Trainer"
        },
        date: "2025-04-04 13:20",
        content: `<p>I'm hosting a free workshop on "Building Effective Security Awareness Programs" on April 25th at the Chicago Public Library (Harold Washington Center). It's aimed at small business owners and IT professionals who need to develop security training programs with limited resources.</p>
        <p>More details and registration here: [link removed]</p>`,
        votes: 7
      }
    ],
    views: 286,
    lastUpdated: "yesterday"
  }
];

// Comment component for nested replies
const Comment = ({ comment, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [voteCount, setVoteCount] = useState(comment.votes || 0);

  return (
    <div className={`pl-${level > 0 ? level * 4 : 0} pt-4`}>
      <Card className="p-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setVoteCount(voteCount + 1)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{voteCount}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setVoteCount(voteCount - 1)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{comment.author.name}</div>
                <div className="text-xs text-muted-foreground">{comment.author.role}</div>
              </div>
              <div className="text-xs text-muted-foreground ml-auto">{comment.date}</div>
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: comment.content }} />
            
            <div className="flex items-center gap-2 mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Flag className="h-3 w-3 mr-1" />
                Report
              </Button>
            </div>
            
            {showReplyForm && (
              <div className="mt-4">
                <Textarea placeholder="Write your reply..." className="mb-2" />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>Cancel</Button>
                  <Button size="sm">Submit</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {comment.replies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  );
};

const DiscussionPost = () => {
  const { id } = useParams<{ id: string }>();
  const discussion = discussionsData.find(discussion => discussion.id === id);
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (!discussion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-mono font-medium mb-6">Discussion Not Found</h1>
        <p className="mb-8">The discussion you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/discussions">Return to Discussions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/discussions" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discussions
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-mono font-bold pr-4">{discussion.title}</h1>
          <Badge>{discussion.category}</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
            <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{discussion.author.name}</div>
            <div className="text-xs text-muted-foreground">{discussion.author.role}</div>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {discussion.date}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {discussion.replies.length} replies
            </div>
          </div>
        </div>
        
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none border-l-4 border-l-indigo-500 pl-4" dangerouslySetInnerHTML={{ __html: discussion.content }} />
        
        <div className="flex items-center justify-between">
          <Button onClick={() => setShowReplyForm(!showReplyForm)} className="flex items-center gap-2">
            <Reply className="h-4 w-4" />
            Reply to Discussion
          </Button>
          <div className="text-sm text-muted-foreground">
            Last updated: {discussion.lastUpdated}
          </div>
        </div>
        
        {showReplyForm && (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Post a Reply</h3>
            <Textarea placeholder="Share your thoughts..." className="min-h-32 mb-3" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReplyForm(false)}>Cancel</Button>
              <Button>Post Reply</Button>
            </div>
          </Card>
        )}
        
        <Separator />
        
        <div>
          <h2 className="text-xl font-mono font-medium mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
            Replies ({discussion.replies.length})
          </h2>
          
          {discussion.replies.map(reply => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPost;
