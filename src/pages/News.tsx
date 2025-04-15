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
  badge: string; // ✅ was 'category'
  tags?: string[];
  image?: string | null;
  source?: string;
};

type ApiResponse = {
  results: NewsItem[];
  page: number;
  pageSize: number;
  total: number;
};

const News = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: reset ? "1" : page.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/fetch-news?${params.toString()}`);
      const data: ApiResponse = await res.json();

      const newResults = reset ? data.results : [...allNews, ...data.results];
      setAllNews(newResults);
      setHasMore(data.results.length >= 12);
      setPage(reset ? 2 : page + 1);
    } catch (err) {
      console.error("Failed to load news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(true);
  }, [searchQuery]);

  const filtered = selectedCategory
    ? allNews.filter((item) => item.badge === selectedCategory || item.tags?.includes(selectedCategory))
    : allNews;

  const sortedNews = [...filtered].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const categories = Array.from(
    new Set(allNews.flatMap((item) => [item.badge, ...(item.tags || [])]))
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
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
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem onSelect={() => setSelectedCategory("")}>
                    <span>All Categories</span>
                  </CommandItem>
                  {categories.map((category) => (
                    <CommandItem key={category} onSelect={() => setSelectedCategory(category)}>
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
          <ArrowUpDown
            className={`h-4 w-4 transition-transform ${
              sortOrder === "asc" ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Results */}
      {sortedNews.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <p className="text-muted-foreground">No news items found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNews.map((news, index) => (
              <ContentCard
                key={index}
                title={news.title}
                description={news.description}
                date={news.date}
                link={news.link}
                badge={news.badge}
                tags={news.tags}
                image={news.image}
                source={news.source}
                external
                className="hover:shadow-md transition-shadow duration-200 hover:border-blue-200 dark:hover:border-blue-800"
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={() => fetchNews()} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default News;
