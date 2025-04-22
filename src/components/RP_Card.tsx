import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RP_CardProps = {
  title: string;
  summary: string;
  link: string;
  tags?: string[];
};

const badgeColorMap: Record<string, string> = {
  cybersecurity: "bg-blue-600 text-white",
  ml: "bg-purple-500 text-white",
  ai: "bg-pink-500 text-white",
  llm: "bg-indigo-500 text-white",
  privacy: "bg-rose-500 text-white",
  iot: "bg-yellow-500 text-black",
  ethics: "bg-slate-600 text-white",
  blockchain: "bg-emerald-500 text-white",
  malware: "bg-red-600 text-white",
  phishing: "bg-orange-600 text-white",
  vulnerability: "bg-fuchsia-600 text-white",
  dataset: "bg-lime-500 text-black",
};

export default function RP_Card({ title, summary, link, tags = [] }: RP_CardProps) {
  const visibleTags = Array.from(
    new Map(tags.map((tag) => [tag.toLowerCase(), tag])).values()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      viewport={{ once: true }}
      className="h-full min-h-[240px] flex flex-col justify-between border border-border rounded-md p-4 bg-secondary/50"
    >
      <div className="space-y-2 flex-1">
        {/* Title */}
        <h3 className="font-sans font-semibold text-base md:text-lg leading-snug break-words">
          {title.length > 220 ? title.slice(0, 215).trim() + "…" : title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-5">
          {summary || <i>No summary available.</i>}
        </p>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border bg-accent text-accent-foreground",
                  badgeColorMap[tag] ?? "bg-muted text-muted-foreground"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center text-sm font-medium pt-3 text-blue-500 hover:underline mt-auto">
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center">
          Read full paper <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
