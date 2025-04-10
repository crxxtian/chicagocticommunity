
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
    title: "Chicago Cybersecurity Summit Convenes Industry Leaders",
    description: "The 10th Edition of the Chicago Cybersecurity Summit was held on April 4, 2025, bringing together executives and experts to discuss emerging threats and solutions.",
    date: "2025-04-04",
    link: "https://cybersecuritysummit.com/summit/chicago25-april/",
    category: "Events"
  },
  {
    id: 2,
    title: "Midwest Cyber Security Alliance Discusses Data Breach Trends",
    description: "On April 9, 2025, the Midwest Cyber Security Alliance hosted a meeting focusing on recent data breach trends and enforcement actions.",
    date: "2025-04-09",
    link: "https://www.midwestcyber.org/events/cyber-litigation-and-enforcement-trends",
    category: "Events"
  },
  {
    id: 3,
    title: "SRAM Investigates Cybersecurity Incident",
    description: "Chicago-based bicycle component manufacturer SRAM is investigating an IT systems outage caused by a potential cybersecurity issue.",
    date: "2025-04-01",
    link: "https://www.bicycleretailer.com/industry-news/2025/04/01/sram-still-investigating-cybersecurity-issue",
    category: "Incidents"
  },
  {
    id: 4,
    title: "SuperCom Expands Electronic Monitoring in Midwest",
    description: "SuperCom has secured a contract to introduce its electronic monitoring technology into Wisconsin, Minnesota, and Michigan.",
    date: "2025-04-10",
    link: "https://www.stocktitan.net/news/SPCB/super-com-signs-new-contract-with-midwestern-electronic-monitoring-gz9they6zpdh.html",
    category: "Business"
  },
  {
    id: 5,
    title: "High Wire Networks Anticipates Surge in Cyberwarfare Amid Trade Tensions",
    description: "Batavia-based High Wire Networks expects increased demand for cybersecurity solutions due to escalating global tariff tensions.",
    date: "2025-04-10",
    link: "https://www.stocktitan.net/news/HWNI/high-wire-networks-overwatch-cybersecurity-unit-anticipates-surge-in-pk63372jsnyl.html",
    category: "Business"
  },
  {
    id: 6,
    title: "Minnesota's IT Head Warns of Cybersecurity Funding Cuts",
    description: "Minnesota's top IT official warns that a pause or cancellation of federal cybersecurity funding could leave local entities vulnerable.",
    date: "2025-04-02",
    link: "https://www.axios.com/local/twin-cities/2025/04/02/minnesota-cybersecurity-funding-freeze",
    category: "Policy"
  },
  {
    id: 7,
    title: "University of Chicago Study Reveals Gaps in Cybersecurity Training",
    description: "A new study from the University of Chicago highlights deficiencies in common types of cybersecurity training programs.",
    date: "2025-04-01",
    link: "https://physicalsciences.uchicago.edu/news/article/new-study-reveals-gaps-in-common-types-of-cybersecurity-training/",
    category: "Education"
  },
  {
    id: 8,
    title: "Illinois Public Sector Cybersecurity Summit Announced",
    description: "The Illinois Public Sector Cybersecurity Summit is scheduled to address challenges faced by government IT security professionals.",
    date: "2025-04-10",
    link: "https://events.govtech.com/Illinois-Public-Sector-Cybersecurity-Summit.html",
    category: "Events"
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
