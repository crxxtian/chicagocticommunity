import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ContentCard } from "@/components/ContentCard";

type Item = {
  title: string;
  description: string;
  date?: string;
  link: string;
  category?: string;
  source?: string;
  image?: string;
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    Promise.all([
      fetch("/api/fetch-news")
        .then((res) => res.json())
        .then((data) => Array.isArray(data) ? data : []),
      fetch("/data/mini-reports.json")
        .then((res) => res.json())
        .then((data) => Array.isArray(data) ? data : [])
        .catch(() => []),
    ])
      .then(([news, reports]) => {
        const allItems = [...news, ...reports];
        console.log("🔍 Total items:", allItems.length);

        const matches = allItems.filter((item: Item) => {
          const text = `${item.title || ""} ${item.description || ""} ${item.category || ""} ${item.source || ""}`.toLowerCase();
          return text.includes(query);
        });

        console.log("✅ Matches:", matches.length);
        setResults(matches);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6 font-mono">Search Results</h1>
      {loading && <p className="text-muted-foreground">Searching...</p>}
      {!loading && results.length === 0 && (
        <p className="text-muted-foreground">No results found for “{query}”.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, i) => (
          <ContentCard
            key={i}
            title={item.title}
            description={item.description}
            date={item.date}
            link={item.link}
            badge={item.category}
            image={item.image}
            source={item.source}
            external={item.link.startsWith("http")}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
