import { useState, useEffect } from "react";
import { ContentCard } from "@/components/ContentCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, ArrowUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type NewsItem = {
  title: string;
  description: string;
  date: string;
  link: string;
  category: string;
  image?: string | null;
  source?: string;
};


const News = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/fetch-news")
      .then((res) => res.json())
      .then((data: NewsItem[]) => {
        setAllNews(data);
        setFilteredNews(data);
      })
      .catch((err) => {
        console.error("Failed to load news", err);
      });
  }, []);

  useEffect(() => {
    let result = [...allNews];

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNews(result);
  }, [searchQuery, selectedCategory, sortOrder, allNews]);

  const categories = Array.from(
    new Set(allNews.map((item) => item.category))
  ).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-4">News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest cybersecurity news and events relevant to
          the Chicagoland area.
        </p>
      </div>

      {/* Search and Filters */}
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
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedCategory === "" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span>All Categories</span>
                  </CommandItem>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      onSelect={() => setSelectedCategory(category)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedCategory === category
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
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
          onClick={() =>
            setSortOrder(sortOrder === "desc" ? "asc" : "desc")
          }
        >
          <Calendar className="h-4 w-4 text-amber-500" />
          <span>Date</span>
          <ArrowUpDown
            className={`h-4 w-4 transition-transform ${
              sortOrder === "asc" ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Results */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            No news items found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news, index) => (
            <ContentCard
            key={index}
            title={news.title}
            description={news.description}
            date={news.date}
            link={news.link}
            badge={news.category}
            image={news.image}
            source={news.source}
            external // ensures external links use <a> not <Link>
            className="hover:shadow-md transition-shadow duration-200 hover:border-blue-200 dark:hover:border-blue-800"
          />          
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
