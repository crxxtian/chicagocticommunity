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

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/\n/g, " ") // remove line breaks
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();

const Search = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const rawQuery =
    searchParams.get("search") || searchParams.get("query") || "";
  const query = normalize(rawQuery);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(false);

    const fetchSources = async (): Promise<Item[]> => {
      try {
        const [newsRes, reportsRes] = await Promise.all([
          fetch("/api/fetch-news").then((res) => res.ok ? res.json() : []),
          fetch("/data/mini-reports.json").then((res) =>
            res.ok ? res.json() : []
          ).catch(() => []),
        ]);
        return [...newsRes, ...reportsRes];
      } catch (err) {
        console.error("Search fetch error:", err);
        setError(true);
        return [];
      }
    };

    fetchSources().then((data) => {
      const filtered = data.filter((item) => {
        const content = normalize(
          `${item.title} ${item.description} ${item.category ?? ""} ${item.source ?? ""}`
        );
        return content.includes(query);
      });

      console.log("Search results for:", query, "->", filtered);
      setResults(filtered);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6 font-mono">Search Results</h1>

      {loading && <p className="text-muted-foreground">Searching...</p>}
      {error && (
        <p className="text-red-500">
          Something went wrong while loading search results.
        </p>
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
            badge={item.category}
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
