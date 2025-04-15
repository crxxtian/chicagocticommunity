import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ContentCardProps {
  title: string;
  description: string;
  link?: string;
  date?: string;
  badge?: string;
  tags?: string[];
  source?: string;
  external?: boolean;
  image?: string | null;
  className?: string;
  variant?: "news" | "report" | "spotlight"; // 🆕 controls sizing
}

export function ContentCard({
  title,
  description,
  link,
  date,
  badge = "General",
  tags = [],
  source,
  external = false,
  image,
  className,
  variant = "news", // 🆕 default variant
}: ContentCardProps) {
  const formattedDate = date
    ? new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // 🎨 Smart visual tweaks per variant
  const clampTitle =
    variant === "news" ? "line-clamp-4" : "line-clamp-2";
  const clampDescription =
    variant === "news" ? "line-clamp-3" : "line-clamp-2";
  const minHeight =
    variant === "news"
      ? "min-h-[360px]"
      : variant === "report"
      ? "min-h-[280px]"
      : "min-h-[240px]";

  const badgeColorMap: Record<string, string> = {
    Ransomware: "bg-red-600 text-white",
    CVE: "bg-yellow-400 text-black",
    CISA: "bg-blue-600 text-white",
    APT: "bg-purple-700 text-white",
    Chicago: "bg-green-600 text-white",
    Vulnerability: "bg-orange-500 text-white",
    "Data Breach": "bg-rose-500 text-white",
    "Zero-Day": "bg-pink-500 text-white",
    Phishing: "bg-indigo-600 text-white",
    Healthcare: "bg-emerald-600 text-white",
    Education: "bg-cyan-600 text-white",
    Russia: "bg-red-800 text-white",
    China: "bg-orange-700 text-white",
    Iran: "bg-teal-600 text-white",
    "North Korea": "bg-blue-800 text-white",
    "United States": "bg-gray-600 text-white",
    NATO: "bg-sky-700 text-white",
    Malware: "bg-zinc-800 text-white",
    Exploit: "bg-orange-600 text-white",
    Patch: "bg-lime-500 text-black",
    DDoS: "bg-fuchsia-700 text-white",
    General: "bg-muted text-muted-foreground",
  };

  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      viewport={{ once: true }}
      className={cn(
        `h-full ${minHeight} flex flex-col justify-between border border-border rounded-md p-4 hover:bg-secondary/50 transition-colors`,
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="rounded-md mb-3 w-full h-32 object-cover"
        />
      )}

      <div className="space-y-2 flex-1">
        {/* Title & date row */}
        <div className="flex justify-between items-start gap-4">
          <h3
            className={cn(
              "font-sans font-semibold text-base md:text-[1.05rem] leading-snug break-words",
              clampTitle
            )}
            title={title}
          >
            {title.length > 250 ? title.slice(0, 245).trim() + "…" : title}
          </h3>
          {formattedDate && (
            <span className="text-xs text-muted-foreground text-right shrink-0 whitespace-nowrap">
              {formattedDate}
            </span>
          )}
        </div>

        {/* Description */}
        {description ? (
          <p className={cn("text-sm text-muted-foreground", clampDescription)}>
            {description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No summary available.
          </p>
        )}

        {/* Tags & badge */}
        <div className="flex flex-wrap gap-2 pt-1">
          {badge && (
            <span
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full border",
                badgeColorMap[badge] || badgeColorMap["General"]
              )}
            >
              {badge}
            </span>
          )}
          {tags
            .filter((tag) => tag !== badge)
            .map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border bg-accent text-accent-foreground",
                  badgeColorMap[tag] ?? ""
                )}
              >
                {tag}
              </span>
            ))}
        </div>

        {/* Source */}
        {source && (
          <p className="text-xs text-muted-foreground italic pt-1">
            Source: {source}
          </p>
        )}
      </div>

      {/* Read more link */}
      {link && (
        <div className="flex items-center text-sm font-medium pt-3 text-primary hover:underline mt-auto">
          {external ? (
            <>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
              <ExternalLink className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Read more</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </div>
      )}
    </motion.div>
  );

  return link && !external ? (
    <Link to={link} className="block h-full">
      {CardContent()}
    </Link>
  ) : (
    CardContent()
  );
}
