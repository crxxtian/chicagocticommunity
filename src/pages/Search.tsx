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
  tags?: string[];
  badge?: string;
};

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const Search = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const rawQuery = searchParams.get("search") || searchParams.get("query") || "";
  const query = normalize(rawQuery);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(false);

    const runSearch = async () => {
      try {
        const res = await fetch(`/api/fetch-news?search=${encodeURIComponent(query)}&limit=100`);
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        const items: Item[] = json.results || [];

        const filtered = items.filter((item) => {
          const content = normalize(
            `${item.title} ${item.description} ${item.category ?? ""} ${item.source ?? ""} ${item.tags?.join(" ") ?? ""}`
          );
          return content.includes(query);
        });

        console.log("Search results for:", query, "→", filtered);
        setResults(filtered);
      } catch (err) {
        console.error("Search fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6 font-mono">Search Results</h1>

      {loading && <p className="text-muted-foreground">Searching...</p>}
      {error && (
        <p className="text-red-500">Something went wrong while loading search results.</p>
      )}
      {!loading && !error && results.length === 0 && (
        <p className="text-muted-foreground">No results found for “{rawQuery}”.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, i) => (
          <ContentCard
            key={i}
            title={item.title}
            description={item.description}
            date={item.date}
            link={item.link}
            badge={item.badge || item.category}
            image={item.image}
            source={item.source}
            external={item.link?.startsWith("http")}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
