import { useState, useEffect } from "react";
import { ContentCard } from "@/components/ContentCard";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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

// Extract unique categories
const categories = Object.keys(groupedDiscussions);

const Discussions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredDiscussions, setFilteredDiscussions] = useState<typeof discussions>([]);
  
  // Apply filters
  useEffect(() => {
    let result: typeof discussions = [];
    
    // If a category is selected, only show items from that category
    if (activeCategory) {
      result = groupedDiscussions[activeCategory] || [];
    } else {
      // Otherwise, show all discussions
      result = discussions;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredDiscussions(result);
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">Discussions</h1>
        <p className="text-muted-foreground">
          Join conversations about cybersecurity topics relevant to the Chicago area.
        </p>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
        <Input 
          placeholder="Search discussions..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {/* Categories Navigation */}
      <div className="mb-8">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  activeCategory === null && "bg-accent text-accent-foreground"
                )}
                onClick={() => setActiveCategory(null)}
              >
                All Topics
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {categories.map((category) => (
              <NavigationMenuItem key={category}>
                <NavigationMenuTrigger
                  className={cn(
                    activeCategory === category && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <ScrollArea className="h-[200px]">
                        <div className="p-2">
                          <div className="font-mono text-sm mb-2 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                            {category} Discussions
                          </div>
                          {groupedDiscussions[category].map((discussion) => (
                            <NavigationMenuLink
                              key={discussion.id}
                              href={discussion.link}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{discussion.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {discussion.description}
                              </p>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </ScrollArea>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Discussion Cards */}
      {filteredDiscussions.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <p className="text-muted-foreground">No discussions found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiscussions.map((discussion) => (
            <ContentCard
              key={discussion.id}
              title={discussion.title}
              description={discussion.description}
              link={discussion.link}
              badge={discussion.category}
              className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-indigo-400 dark:border-l-indigo-600 hover:border-indigo-500 dark:hover:border-indigo-400 animate-in fade-in duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussions;
