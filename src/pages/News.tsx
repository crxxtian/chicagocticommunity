
import { useState, useEffect } from "react";
import { ContentCard } from "@/components/ContentCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, ArrowUpDown } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const newsItems = [
  {
    id: 1,
    title: "New Phishing Campaign Targeting Local Businesses",
    description: "Attackers impersonating ComEd are sending malicious emails to businesses in the Chicago area. Learn what to watch for.",
    date: "2025-04-09",
    link: "/news/1",
    category: "Phishing"
  },
  {
    id: 2,
    title: "Critical Windows Vulnerability Patched",
    description: "Microsoft released an emergency patch for a zero-day vulnerability being actively exploited. Update systems immediately.",
    date: "2025-04-08",
    link: "/news/2",
    category: "Vulnerabilities"
  },
  {
    id: 3,
    title: "Ransomware Attack Affects Local Healthcare Provider",
    description: "A Chicago-based healthcare provider is recovering from a targeted ransomware attack that impacted patient scheduling systems.",
    date: "2025-04-07",
    link: "/news/3",
    category: "Ransomware"
  },
  {
    id: 4,
    title: "Chicago Tech Summit to Feature Cybersecurity Track",
    description: "The annual Chicago Tech Summit announced a dedicated cybersecurity track with speakers from leading organizations. Registration is now open.",
    date: "2025-04-06",
    link: "/news/4",
    category: "Events"
  },
  {
    id: 5,
    title: "CISA Issues Alert for Critical Infrastructure in Midwest",
    description: "CISA has issued a regional alert regarding potential cyber threats targeting critical infrastructure in the Midwest, including Chicago area utilities.",
    date: "2025-04-05",
    link: "/news/5",
    category: "Alerts"
  },
  {
    id: 6,
    title: "Chicago PD Expands Cyber Crime Unit",
    description: "The Chicago Police Department announced the expansion of its Cyber Crime Unit to better address the growing number of digital crimes affecting residents.",
    date: "2025-04-04",
    link: "/news/6",
    category: "Local"
  },
  {
    id: 7,
    title: "Local University Launches Cybersecurity Scholarship Program",
    description: "A major Chicago university has launched a new scholarship program aimed at increasing diversity in cybersecurity education and careers.",
    date: "2025-04-03",
    link: "/news/7",
    category: "Education"
  },
  {
    id: 8,
    title: "DDoS Attacks Disrupt Chicago Transit Authority Website",
    description: "The CTA website experienced intermittent outages due to distributed denial-of-service attacks. No operational systems were affected.",
    date: "2025-04-02",
    link: "/news/8",
    category: "Attacks"
  }
];

// Extract unique categories for filter
const categories = Array.from(new Set(newsItems.map(item => item.category)));

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filteredNews, setFilteredNews] = useState(newsItems);
  
  // Filter and sort news items based on current filters
  useEffect(() => {
    let result = [...newsItems];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredNews(result);
  }, [searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest cybersecurity news and events relevant to the Chicagoland area.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
          <Input 
            placeholder="Search news..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-500" />
              <span>Filter {selectedCategory ? `by ${selectedCategory}` : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem 
                    onSelect={() => setSelectedCategory("")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full ${selectedCategory === "" ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span>All Categories</span>
                  </CommandItem>
                  {categories.map((category) => (
                    <CommandItem 
                      key={category}
                      onSelect={() => setSelectedCategory(category)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${selectedCategory === category ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span>{category}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto flex items-center gap-2"
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        >
          <Calendar className="h-4 w-4 text-amber-500" />
          <span>Date</span>
          <ArrowUpDown className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Results display */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <p className="text-muted-foreground">No news items found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <ContentCard
              key={news.id}
              title={news.title}
              description={news.description}
              date={news.date}
              link={news.link}
              badge={news.category}
              className="hover:shadow-md transition-shadow duration-200 hover:border-blue-200 dark:hover:border-blue-800"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
